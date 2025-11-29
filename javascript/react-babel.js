const cellStyle = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  color: "#f5f7ff",
};

const headerStyle = {
  padding: "10px",
  textAlign: "left",
  color: "#b7bfd6",
  fontWeight: "600",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
};

function BookingRow(props) {
  return (
    <tr>
      <td style={cellStyle}>{props.name || "-"}</td>
      <td style={cellStyle}>{props.company || "-"}</td>
      <td style={cellStyle}>{props.location || "-"}</td>
      <td style={cellStyle}>{props.date || "-"}</td>
      <td style={cellStyle}>{props.dateto || "-"}</td>
      <td style={cellStyle}>{props.cost || "-"}</td>
      <td style={cellStyle}>{props.position || "-"}</td>
    </tr>
  );
}

class ProductList extends React.Component {
  render() {
    if (!this.props.bookings || this.props.bookings.length === 0) {
      return (
        <p style={{ padding: "20px", color: "#b7bfd6" }}>No bookings found.</p>
      );
    }

    const headers = [
      "Name",
      "Company",
      "Location",
      "Date From",
      "Date To",
      "Cost",
      "Seat number", // corresponds to position
    ];

    return (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} style={headerStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.props.bookings.map((booking) => (
            <BookingRow
              key={booking.key}
              name={booking.name}
              company={booking.company}
              location={booking.location}
              date={booking.date}
              dateto={booking.dateto}
              cost={booking.cost}
              position={booking.position}
            />
          ))}
        </tbody>
      </table>
    );
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

function ResultBookingsCustomer(returnedData) {
  // Here we render using React
  ReactDOM.render(
    <ProductList bookings={returnedData} />,
    document.getElementById("react-data-dump")
  );
}
