class Calculator {
    constructor(form, summary) {
        //1. Wyszukiwanie elementów - zdefiniowanie zmiennych
        // this.prices to obiekt, który zawiera pojedyncze ceny oferty
        this.prices = {
            products: 0.5,
            orders: 0.25,
            package: {
                basic: 0,
                professional: 25,
                premium: 60,
            },
            accounting: 35,
            terminal: 5,
        };
        // this.form to obiekt, który zawiera wyszukane elementy formularza, którym zostanie przypisana wartość ceny z obiektu this.prices
        this.form = {
            products: form.querySelector("#products"),
            orders: form.querySelector("#orders"),
            package: form.querySelector("#package"),
            accounting: form.querySelector("#accounting"),
            terminal: form.querySelector("#terminal"),
        }
        // this.summary to obiekt, który zawiera wyszukane elementy, którym zostanie przypisana wartość ceny z obiektów this.prices pomnożona razy ilość zamówionych produktów i ilość złożonych zamówień orders. Zawartość this.summary wyświetla się po dodaniu klasy "open". Przed złożeniem zamówienia zawartość obiektu this.summary jest ukryta
        this.summary = {
            list: summary.querySelector("ul.calc__list"),
            items: summary.querySelector("ul").children, // To wyrażenie używa querySelector do znalezienia pierwszego elementu <ul> wewnątrz summary, a następnie używa właściwości children, aby uzyskać kolekcję wszystkich bezpośrednich dzieci tego <ul>
            total: {
                container: summary.querySelector("#total-price"), // Wyszukane, aby wyświetlić z klasy open cały kontener dla podliczonej ceny
                price: summary.querySelector(".total__price"), // Całkowita cena usług w sumie, przypisana do wyszukanego id total__price
            },
        };

        this.addEvents(); // W tej funkcji addEvents() nie jest używane słowo return, ponieważ jej celem jest wykonanie operacji, a nie zwracanie wartości
    }

    //Zdefiniowanie metod ES6 w prototypie klasy Calculator
    //2. Obsługa pól tekstowych
    inputEvent(e) {
        const id = e.currentTarget.id; // Zwraca id elementu, który został kliknięty
        const value = e.currentTarget.value; // Zwraca wartość wpisaną przez użytkownika do inputa z wybranym identyfikatorem #products albo #orders
        const singlePrice = this.prices[id];// Cena pojedynczego produktu albo zamówienia, odczytana z obiektu na podstawie wybranego produktu albo zamówienia
        const totalPrice = value * singlePrice;// Wynik mnożenia produkt/zamówienie x cena jednostkowa produktu/zamówienia
        this.updateSummary(id, `${value} * $${singlePrice}`, totalPrice, function (item, calc, total) {
            if (value < 0) {
                calc.innerText = null;
                total.innerText = 'Value should be greater than 0'
            }

            if (value.length === 0) {
                item.classList.remove("open");
            }
        });

        this.updateTotal();
    }

    // 2.2. Aktualizacja
    // Wszystkie dane wyszukane i policzone w update summary wyświetlą się z prawej strony formularza za pomocą dodanej klasy "open'.
    updateSummary(id, calc, total, callback) {
        // Przypisanie do zmiennej summary wybranego elementu z listy o identyfikatorze products, orders, albo package
        const summary = this.summary.list.querySelector(`[data-id=${id}]`);
        const summaryCalc = summary.querySelector(".item__calc"); // To wyrażenie wyszukuje element z klasą .item__calc w kontekście konkretnego elementu summary.
        const summaryTotal = summary.querySelector(".item__price");
        // Aby dane pole się pojawiło musimy dodać klasę open
        summary.classList.add("open");

        if (summaryCalc !== null) {
            summaryCalc.innerText = calc;
        }
        summaryTotal.innerText = `$${total}`;

        if (typeof callback === 'function') {
            callback(summary, summaryCalc, summaryTotal)
        }
    }

    // 3. Otwieranie i zamykanie
    // 3.1. Metoda, dzięki której obsłużymy niestandardowy select
    selectEvent(e) {
        this.form.package.classList.toggle("open"); // Poprzez toggle będziemy przełączać klasę open na głównym elemencie selecta, który został wyszukany i zapisany w kluczu this.form.package
        //3.2. Wyciąganie wartości
        const value = typeof e.target.dataset.value !== "undefined" ? e.target.dataset.value : "";
        const text = typeof e.target.dataset.value !== "undefined" ? e.target.innerText : "Choose package";
        //3.3. Aktualizacja
        // Warunek sprawdzający, czy długość wartości jest większa od 0. Jeżeli tak to przeprowadzamy aktualizację
        if(value.length > 0) {
            this.form.package.dataset.value = value;
            this.form.package.querySelector(".select__input").innerText = text;
            this.updateSummary("package", text, this.prices.package[value]);
            this.updateTotal();
        }
    }

    //4. Obsługa checkboxów
    checkboxEvent(e) {
        const checkbox = e.currentTarget;
        const id = checkbox.id;
        const checked = e.currentTarget.checked;
        this.updateSummary(id, undefined, this.prices[id], function (item) {
            if(!checked) {
                item.classList.remove("open");
            }
        });

        this.updateTotal();
    }

    //5. Dodanie wydarzeń - stworzene addEventListenerów
    addEvents() {
        //5.1. Inputy - podpięcie zdarzeń keyup i change do inputów: this.form.products i this.form.orders:
        this.form.products.addEventListener("change", (e) => this.inputEvent(e));
        this.form.products.addEventListener("keyup", (e) => this.inputEvent(e));
        this.form.orders.addEventListener("change", (e) => this.inputEvent(e));
        this.form.orders.addEventListener("keyup", (e) => this.inputEvent(e));

        //5.2. Select - tutaj reagujemy tylko na zdarzenie kliknięcia
        this.form.package.addEventListener("click", (e) => this.selectEvent(e));

        //5.3. Checkboxy - tutaj nakładamy nasłuchiwanie na zdarzenie change w checkboxach accounting i terminal, aby reagować na stan zmiany stanu zaznaczenia checkboxa
        this.form.accounting.addEventListener("change", (e) => this.checkboxEvent(e));
        this.form.terminal.addEventListener("change", (e) => this.checkboxEvent(e));
    };

    //6. Aktualizacja sumy
    // Dodanie metody, która będzie aktualizować i zliczać sumę całego kalkulatora
    updateTotal() {
        const show = this.summary.list.querySelectorAll(".open").length > 0;

        if(show) {
        const productSum = this.form.products.value < 0 ? 0 : this.form.products.value * this.prices.products;
        const ordersSum = this.form.orders.value < 0 ? 0 : this.form.orders.value * this.prices.orders;
        const packagePrice = this.form.package.dataset.value.length === 0 ? 0 : this.prices.package[this.form.package.dataset.value];
        const accounting = this.form.accounting.checked ? this.prices.accounting : 0;
        const terminal = this.form.terminal.checked ? this.prices.terminal : 0;
        // Na koniec wpiszemy sumę wszystkich cen do odpowiedniego elementu
        this.summary.total.price.innerText = `$${productSum + ordersSum + packagePrice + accounting + terminal}`;
        this.summary.total.container.classList.add("open");
        } else {
            this.summary.total.container.classList.remove("open");
        }
    }
}

//7. Utworzenie instancji dla funkcji konstruktora class Calculator
// Utworzenie instancji klasy za pomocą new jest kluczowe, aby używać funkcji i właściwości zdefiniowanych w tej klasie. Bez tego klasa istnieje tylko jako definicja i nie jest aktywnie używana w kodzie
const form = document.querySelector(".calc__form");
const summary = document.querySelector(".calc__summary")
new Calculator(form, summary);