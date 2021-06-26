import React, { useEffect, useState } from "react";
import CurrencyField from "./CurrencyField";

const BASE_URL =
  "http://api.exchangeratesapi.io/latest?access_key=47f3770ff771d5ada3553bce48b242ef";

function CurrencyConverter() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate || 0;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate || 0;
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1);
    } else {
      fetch(`${BASE_URL}&base=${fromCurrency}&symbols=${toCurrency}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success === false) {
            setExchangeRate(1);
            // console.log(data.error.type);
          } else {
            setExchangeRate(data.rates[toCurrency]);
          }
        });
    }
  }, [fromCurrency, toCurrency]);

  const handleFromAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  };

  const handleToAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  };

  return (
    <>
      <h1>Currency Converter</h1>
      <div className="card">
        <label className="text-muted">From</label>
        <CurrencyField
          currencyOptions={currencyOptions}
          selectedCurrency={fromCurrency}
          onChangeCurrency={(e) => setFromCurrency(e.target.value)}
          onChangeAmount={handleFromAmountChange}
          amount={fromAmount}
        />
        <i className="text-note">
          Select <span style={{ fontWeight: "bold" }}>EUR</span> as base
          currency
        </i>

        <div className="text-center p-5">
          <i className="fa fa-exchange" aria-hidden="true"></i>
        </div>

        <label className="text-muted">To</label>
        <CurrencyField
          currencyOptions={currencyOptions}
          selectedCurrency={toCurrency}
          onChangeCurrency={(e) => setToCurrency(e.target.value)}
          onChangeAmount={handleToAmountChange}
          amount={toAmount}
        />
      </div>

      <div className="alert alert-warning" role="alert">
        <span style={{ fontWeight: "bold" }}>NB:</span> Due to the fact that I
        used a free API plan. I was limited to some things such as "changing
        base currency not allowed" which literally means changing FROM currency
        is not allowed but changing TO currency works perfectly.Thanks!
      </div>
    </>
  );
}

export default CurrencyConverter;
