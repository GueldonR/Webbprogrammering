function Product(props) {
  return (
    <li>
      {props.name} {props.color}
    </li>
  );
}

class ProductList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const listItems = this.props.codes.map((code) => (
      <Product key={code.code} name={code.name} color={code.color} />
    ));
    return <ul>{listItems}</ul>;
  }
}

// To do för VG:
// Hooka upp react koden
// Table format
// för cssen ta bort css klassen och lägg till den on hover med JS
// async laddning av bokning
// MYpages Async borttagning av bokningar
// Implementera sortering i sökningssidan
// implementera error hantering på login och registrering

async function getData(customerID) {
  // lägg till urlen för att hämta bookings
  const Type = TravelDoctor;
  const response = await fetch("../API/booking/getcustomerbookings_JSON.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerID: customerID, type: Type }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      ReactDOM.render(
        <ProductList codes={data} />,
        // peka på ett div där du vill skriva ut datan
        document.getElementById("react-data-dump")
      );
    });
}

getData(customerID);
