let API_KEY = "af9f63c59a649f27d602b96a43d0bd14";
        let form = document.querySelector("form");
        let city = document.querySelector("#city");
        let weather = document.querySelector("#city-weather-container");
        let consoleOutput = document.querySelector("#console-output");
        let historyCities = document.querySelector("#searched-cities-box");

      
        function log(msg, type = "sync") {
            const line = document.createElement("div");
            line.className = `log-${type}`;
            line.textContent = msg;
            consoleOutput.appendChild(line);
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
            console.log(msg);
        }

        function getHistory() {
            return JSON.parse(localStorage.getItem("weatherHistory") || "[]");
        }

        function saveToHistory(cityName) {
            let history = getHistory();
            cityName = cityName.trim();
            if (!history.includes(cityName)) {
                history.unshift(cityName);
                if (history.length > 8) history.pop();
                localStorage.setItem("weatherHistory", JSON.stringify(history));
            }
            renderHistory();
        }

        function renderHistory() {
            const history = getHistory();
            historyCities.innerHTML = "";
            history.forEach(c => {
                const chip = document.createElement("span");
                chip.className = "chip";
                chip.textContent = c;
                chip.addEventListener("click", () => {
                    city.value = c;
                    getWeather(c);
                });
                historyCities.appendChild(chip);
            });
        }

     
        async function getWeather(cityName) {
            consoleOutput.innerHTML = "";

            log("Sync Start", "sync");
            log("Sync End", "sync");
            log("[ASYNC] Start fetching", "async");

            Promise.resolve().then(() => log("Promise.then (Microtask)", "micro"));
            setTimeout(() => log("setTimeout (Macrotask)", "macro"), 0);

            try {
                let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);

                if (!response.ok) {
                    weather.innerHTML = `<p class="error-msg">City not found</p>`;
                    log("[ASYNC] Error – city not found", "async");
                    return;
                }

                let data = await response.json();
                log("[ASYNC] Data received", "async");

                let card = document.createElement('div');
                card.innerHTML = `
                    <table>
                        <tr><td>City</td>    <td>${data.name}, ${data.sys.country}</td></tr>
                        <tr><td>Temp</td>    <td>${data.main.temp} °C</td></tr>
                        <tr><td>Weather</td> <td>${data.weather[0].main}</td></tr>
                        <tr><td>Humidity</td><td>${data.main.humidity}%</td></tr>
                        <tr><td>Wind</td>    <td>${data.wind.speed} m/s</td></tr>
                    </table>`;
                weather.innerHTML = "";
                weather.append(card);

                saveToHistory(cityName);

            } catch (err) {
                weather.innerHTML = `<p class="error-msg">Network error. Try again.</p>`;
                log("[ASYNC] Network error: " + err.message, "async");
            }
        }

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            getWeather(city.value);
        });

        renderHistory();