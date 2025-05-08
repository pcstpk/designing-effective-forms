let clickCount = 0;

const countryInput = document.getElementById('country');
const countryCodeInput = document.getElementById('countryCode');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        const countries = data.map(country => country.name.common);
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');

        const countryCodeOptions = data.flatMap(country => {
            if (country.idd?.root && Array.isArray(country.idd.suffixes)) {
                return country.idd.suffixes.map(suffix => {
                    const code = `${country.idd.root}${suffix}`;
                    return `<option value="${code}">(${code}) ${country.name.common}</option>`;
                });
            } else {
                return [];
            }
        }).join('');
        countryCodeInput.innerHTML = countryCodeOptions;
        getCountryByIP()
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            countryInput.value = country;
            getCountryCode(country);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd pobierania danych');
            }
            return response.json();
        })
        .then(data => {
            const countryCode = data[0].idd.root + data[0].idd.suffixes.join("")
            countryCodeInput.value = countryCode;
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}


(() => {
    // nasłuchiwania na zdarzenie kliknięcia myszką
    document.addEventListener('click', handleClick);

    document.getElementById('vatUE').addEventListener('change', function () {
        const vatNumberContainer = document.getElementById('vatNumberContainer');
        vatNumberContainer.style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('wantInvoice').addEventListener('change', function () {
        const invoiceDataContainer = document.getElementById('invoiceDataContainer');
        invoiceDataContainer.style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('wantAccount').addEventListener('change', function () {
        const invoiceDataContainer = document.getElementById('passwordContainer');
        invoiceDataContainer.style.display = this.checked ? 'block' : 'none';
    });

    fetchAndFillCountries();
})()
