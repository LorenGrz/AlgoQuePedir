package config

object EnvironmentVariables {
    val DEFAULT_MAX_DISTANCE: Double = System.getenv("DEFAULT_MAX_DISTANCE")?.toDoubleOrNull() ?: 5.0
    val API_URL: String = "http://localhost:9000"
}