import Weather from "./weather.js"
import Forecast from "./forecast.js"

const App = {
	init() {
		this.weatherBtn = document.querySelector(".app-switch-btn#btn-weather")
		this.forecastBtn = document.querySelector(".app-switch-btn#btn-forecast")
		this.weatherApp = document.querySelector("#weather-app")
		this.forecastApp = document.querySelector("#forecast-app")
	},

	listenEvent() {
		this.weatherBtn.addEventListener("click", () => {
			showWeatherApp()
      Weather.run()
		})

		this.forecastBtn.addEventListener("click", () => {
			showForecastApp()
      Forecast.run()
		})

		const showWeatherApp = () => {
			this.forecastBtn.classList.remove("active")
			this.forecastApp.classList.remove("active")
			this.weatherBtn.classList.add("active")
			this.weatherApp.classList.add("active")
		}

		const showForecastApp = () => {
			this.weatherBtn.classList.remove("active")
			this.weatherApp.classList.remove("active")
			this.forecastBtn.classList.add("active")
			this.forecastApp.classList.add("active")
		}
	},

	run() {
		this.init()
		this.listenEvent()
    Weather.run()
	}
}

App.run()