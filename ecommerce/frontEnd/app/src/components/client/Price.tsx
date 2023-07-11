interface IPrice {
  currency;
  num;
  numSize;
}

function Price({ currency, num, numSize }: IPrice) {
  return (
    <>
      {currency}
      <span className={numSize}>{num}</span>
    </>
  );
}

export default Price;
