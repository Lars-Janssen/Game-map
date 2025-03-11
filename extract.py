import pandas as pd

file_path = "/media/lars/F77E-7D07/"


def read_csvs(
    file_path="/media/lars/F77E-7D07/"
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Read the games and recommendations csvs and return dataframes.
    """

    games = pd.read_csv(file_path + "games.csv")
    recommendations = pd.read_csv(file_path + "recommendations.csv")

    # Restrict to relevant columns
    games = games[["app_id", "title"]]
    recommendations = recommendations[["app_id", "user_id", "is_recommended"]]

    print("Loaded dataframes!")
    return games, recommendations


def filter_users(
    recommendations: pd.DataFrame, min_recs=10
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Filter the recommendations to only be from users
    that have min_reviews reviews.
    """

    recommendations_per_user = recommendations.groupby("user_id").size()
    users_with_minimum_recs = \
        recommendations_per_user[recommendations_per_user >= min_recs].index

    filtered_recommendations = \
        recommendations[recommendations["user_id"]
                        .isin(users_with_minimum_recs)]

    print(f"Filtered to users with at least {min_recs} reviews")
    return filtered_recommendations


def filter_games(
    games: pd.DataFrame, recommendations: pd.DataFrame, min_recs=100
) -> tuple[pd.DataFrame, pd.DataFrame]:

    recommendations_per_game = recommendations.groupby("app_id").size()
    games_with_minimum_recs = \
        recommendations_per_game[recommendations_per_game >= min_recs].index

    filtered_games = games[games["app_id"]
                           .isin(games_with_minimum_recs)]
    filtered_recommendations = \
        recommendations[recommendations["app_id"]
                        .isin(games_with_minimum_recs)]

    print(f"Filtered to games with at least {min_recs} reviews")
    return filtered_games, filtered_recommendations


def to_csvs(
    games: pd.DataFrame, recommendations: pd.DataFrame
) -> None:
    """
    Write the games and recommendations dataframes to csvs.
    """

    games.to_csv("filtered_archive/games.csv", index=False)
    recommendations.to_csv("filtered_archive/recommendations.csv", index=False)

    print("Saved dataframes!")


games, recommendations = read_csvs(file_path)
print(len(games), len(recommendations))
recommendations = filter_users(recommendations, 25)
print(len(games), len(recommendations))
games, recommendations = filter_games(games, recommendations, 100)
print(len(games), len(recommendations))
to_csvs(games, recommendations)
