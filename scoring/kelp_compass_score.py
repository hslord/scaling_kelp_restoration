import yaml
import pandas as pd
import numpy as np

def load_config():
    with open("config.yaml", "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def _normalize(series, mean, sd):
    """Normalize a pandas Series to [0, 1] using mean ± 3*SD as bounds."""
    lo = mean - 3 * sd
    hi = mean + 3 * sd
    return ((series - lo) / (hi - lo)).clip(0.0, 1.0)


def create_compass_score(df, config):
    """
    Compute a composite kelp restoration opportunity score for each row in df.

    Inputs (columns expected in df):
      - Temperature        : sea surface temperature (°C)
      - Salinity level     : salinity (PSU)
      - Ocean Current      : current speed (m/s)
      - kelp_biomass_kg    : Q4 2025 kelp biomass (wet kg / 900 m² pixel)

    Output:
      df with a new 'compass_score' column in [0, 1], where higher = better
      restoration opportunity.

    Scoring logic:
      curr_opp    = 1 - (biomass / MAX_BIOMASS_2025)   # low biomass → high opportunity
      compass_score = W_CURR_OPP * curr_opp
                    + W_TEMP     * norm(Temperature)
                    + W_SAL      * norm(Salinity)
                    + W_CURR     * norm(Ocean Current)
    """

    # Normalize environmental variables
    nt = _normalize(df["Temperature "],     config["TEMP_MEAN"], config["TEMP_SD"])
    ns = _normalize(df["Salinity level"],  config["SAL_MEAN"],  config["SAL_SD"])
    nc = _normalize(df["Ocean Current "],   config["CURR_MEAN"], config["CURR_SD"])

    # Current restoration opportunity: lower biomass → higher opportunity
    # row_max = the higher of the two biomass readings (current vs 10yr ago)
    b2025    = df["kelp_biomass_kg_2025"].fillna(0)
    b2015    = df["kelp_biomass_kg_past_2015"].fillna(0)
    row_max  = pd.concat([b2025, b2015], axis=1).max(axis=1)
    # (row_max - b2025) / row_max → 0 when at historical peak, 1 when fully depleted
    # where row_max == 0 (no kelp ever), set curr_opp = 0 (no opportunity signal)
    curr_opp = ((row_max - b2025) / row_max.replace(0, np.nan)).fillna(0.0).clip(0.0, 1.0)

    df["compass_score"] = (
        config["W_CURR_OPP"] * curr_opp
        + config["W_TEMP"]    * nt
        + config["W_SAL"]     * ns
        + config["W_CURR"]    * nc
    ).round(4)

    return df


if __name__ == "__main__":
    config = load_config()
    df = pd.read_csv(config["INPUT_CSV"])
    df = create_compass_score(df, config)
    df.to_csv('final_compass_score.csv')
    print(df[["latitude", "longitude", "kelp_biomass_kg_2025", "compass_score"]].head())
    print(df['compass_score'].describe())
