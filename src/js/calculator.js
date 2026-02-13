class Calculator {
  constructor(form, summary) {
    // 1. Element selection - defining variables
    // this.prices is an object that contains individual offer prices
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
    // this.form is an object containing the selected form elements,
    // which will be assigned values from the this.prices object
    this.form = {
      products: form.querySelector('#products'),
      orders: form.querySelector('#orders'),
      package: form.querySelector('#package'),
      accounting: form.querySelector('#accounting'),
      terminal: form.querySelector('#terminal'),
    };
    // this.summary is an object containing the selected elements,
    // which will be assigned values from the this.prices object,
    // multiplied by the quantity of products and orders.
    // The content of this.summary is shown by adding the "open" class.
    // Before placing an order, this.summary content is hidden.
    this.summary = {
      list: summary.querySelector('ul.calc__list'),
      items: summary.querySelector('ul').children, // Uses querySelector to find the first <ul> inside summary, then children to get all direct children of this <ul>
      total: {
        container: summary.querySelector('#total-price'), // Selected to display the entire total container when "open" class is added
        price: summary.querySelector('.total__price'), // Total service price assigned to the selected element with id total__price
      },
    };

    this.addEvents(); /// addEvents() does not use return because its purpose is to execute actions, not return a value
  }

  // Defining ES6 methods in Calculator prototype
  // 2. Handling text input fields
  inputEvent(e) {
    const id = e.currentTarget.id; // Returns the id of the element that triggered the event
    const value = e.currentTarget.value; // Returns the value entered by the user in the input with id #products or #orders
    const singlePrice = this.prices[id]; // Single product/order price, taken from the object based on selected input
    const totalPrice = value * singlePrice; // Multiply quantity of product/order by unit price
    this.updateSummary(
      id,
      `${value} * $${singlePrice}`,
      totalPrice,
      function (item, calc, total) {
        if (value < 0) {
          calc.innerText = null;
          total.innerText = 'Value should be greater than 0';
        }

        if (value.length === 0) {
          item.classList.remove('open');
        }
      },
    );

    this.updateTotal();
  }

  // 2.2. Update
  // All data calculated and found in updateSummary will be displayed on the right side of the form when the "open" class is added.
  updateSummary(id, calc, total, callback) {
    // Assign to the 'summary' variable the list element with the data-id of 'products', 'orders', or 'package'
    const summary = this.summary.list.querySelector(`[data-id=${id}]`);
    const summaryCalc = summary.querySelector('.item__calc'); // Finds the element with class .item__calc inside the selected summary item
    const summaryTotal = summary.querySelector('.item__price');
    // To show the field, add the open class
    summary.classList.add('open');

    if (summaryCalc !== null) {
      summaryCalc.innerText = calc;
    }
    summaryTotal.innerText = `$${total}`;

    if (typeof callback === 'function') {
      callback(summary, summaryCalc, summaryTotal);
    }
  }

  // 3. Opening and closing
  // 3.1. Method for handling custom select
  selectEvent(e) {
    this.form.package.classList.toggle('open'); // Toggle the "open" class on the main select element
    // 3.2. Extracting value
    const value =
      typeof e.target.dataset.value !== 'undefined'
        ? e.target.dataset.value
        : '';
    const text =
      typeof e.target.dataset.value !== 'undefined'
        ? e.target.innerText
        : 'Choose package';
    // 3.3. Update
    // Check if the value length is greater than 0. If so, update
    if (value.length > 0) {
      this.form.package.dataset.value = value;
      this.form.package.querySelector('.select__input').innerText = text;
      this.updateSummary('package', text, this.prices.package[value]);
      this.updateTotal();
    }
  }

  // 4. Handling checkboxes
  checkboxEvent(e) {
    const checkbox = e.currentTarget;
    const id = checkbox.id;
    const checked = e.currentTarget.checked;
    this.updateSummary(id, undefined, this.prices[id], function (item) {
      if (!checked) {
        item.classList.remove('open');
      }
    });

    this.updateTotal();
  }

  // 5. Adding events - creating addEventListeners
  addEvents() {
    // 5.1. Inputs - attach keyup and change to this.form.products and this.form.orders
    this.form.products.addEventListener('change', (e) => this.inputEvent(e));
    this.form.products.addEventListener('keyup', (e) => this.inputEvent(e));
    this.form.orders.addEventListener('change', (e) => this.inputEvent(e));
    this.form.orders.addEventListener('keyup', (e) => this.inputEvent(e));

    // 5.2. Select - react only to click events
    this.form.package.addEventListener('click', (e) => this.selectEvent(e));

    // 5.3. Checkboxes - attach change events to accounting and terminal checkboxes to respond to state changes
    this.form.accounting.addEventListener('change', (e) =>
      this.checkboxEvent(e),
    );
    this.form.terminal.addEventListener('change', (e) => this.checkboxEvent(e));
  }

  // 6. Updating total
  // Adds a method to calculate and update the total of the entire calculator
  updateTotal() {
    const show = this.summary.list.querySelectorAll('.open').length > 0;

    if (show) {
      const productSum =
        this.form.products.value < 0
          ? 0
          : this.form.products.value * this.prices.products;
      const ordersSum =
        this.form.orders.value < 0
          ? 0
          : this.form.orders.value * this.prices.orders;
      const packagePrice =
        this.form.package.dataset.value.length === 0
          ? 0
          : this.prices.package[this.form.package.dataset.value];
      const accounting = this.form.accounting.checked
        ? this.prices.accounting
        : 0;
      const terminal = this.form.terminal.checked ? this.prices.terminal : 0;
      // Finally, write the sum of all prices to the appropriate element
      this.summary.total.price.innerText = `$${productSum + ordersSum + packagePrice + accounting + terminal}`;
      this.summary.total.container.classList.add('open');
    } else {
      this.summary.total.container.classList.remove('open');
    }
  }
}

// 7. Creating an instance of the Calculator class
// Using new is necessary to use the functions and properties defined in the class.
// Without it, the class exists only as a definition and is not actively used in code
const form = document.querySelector('.calc__form');
const summary = document.querySelector('.calc__summary');
new Calculator(form, summary);
