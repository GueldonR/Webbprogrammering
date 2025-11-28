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

async function getData() {
  // lägg till urlen för att hämta bookings
  const Type = localStorage.getItem("travel_type") || "TravelDoctor";
  const custID = localStorage.getItem("user_id");

  if (!custID) {
    console.error("No customer ID found");
    return;
  }

  try {
    const response = await fetch(
      "../API/booking/getcustomerbookings_JSON.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerID: custID, type: Type }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Bookings loaded:", data);

    ReactDOM.render(
      <ProductList codes={data} />,
      // peka på ett div där du vill skriva ut datan
      document.getElementById("react-data-dump")
    );
  } catch (error) {
    console.error("Error loading bookings:", error);
    ReactDOM.render(
      <div style={{ color: "red" }}>
        Error loading bookings: {error.message}
      </div>,
      document.getElementById("react-data-dump")
    );
  }
}

// Listen for loadCustData event from login button
// CANT DO THIS ITS NOT IN MEM YET
document.addEventListener("loadCustData", function () {
  const custID = localStorage.getItem("user_id");
  if (custID) {
    getData();
  } else {
    console.warn("Customer ID not available yet");
  }
});

// Dispatch event when login button is clicked
document
  .getElementById("search-customer-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    document.dispatchEvent(new Event("loadCustData"));
  });
