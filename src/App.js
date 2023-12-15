import { useState } from "react";

const borrowerData = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    date: "",
    balance: 100,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    date: "",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    date: "",
    balance: 0,
  },
];

export default function App() {
  const [showAddNew, setShowAddNew] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [borrows, setBorrows] = useState(borrowerData);

  function handleShowAddNew() {
    setShowAddNew((show) => !show);
  }

  function addNewBorrower(borrow) {
    setBorrows((borrows) => [...borrows, borrow]);
    setShowAddNew(false);
  }

  function handleSelectedBorrower(borrow) {
    setSelectedBorrower((selected) =>
      selected?.id === borrow.id ? null : borrow
    );
  }

  function handleFormFillOut(value) {
    setBorrows((borrows) =>
      borrows.map((borrow) =>
        borrow.id === selectedBorrower.id
          ? { ...borrow, balance: borrow.balance + value }
          : borrow
      )
    );
  }

  function handleFormFillOut2(value) {
    setBorrows((borrows) =>
      borrows.map((borrow) =>
        borrow.id === selectedBorrower.id
          ? { ...borrow, date: borrow.date + value }
          : borrow
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <BorrowerList
          onHandleSelectedBorrower={handleSelectedBorrower}
          selectedBorrower={selectedBorrower}
          borrows={borrows}
        />
        {showAddNew && <FormAddBorrower onAddNewBorrower={addNewBorrower} />}
        <Button onClick={handleShowAddNew}>
          {showAddNew ? "Close" : "Add New"}
        </Button>
      </div>
      {selectedBorrower && (
        <FormFillOut
          selectedBorrower={selectedBorrower}
          onFormFillOut={handleFormFillOut}
          onFormFillOut2={handleFormFillOut2}
        />
      )}
    </div>
  );
}

function BorrowerList({ borrows, onHandleSelectedBorrower, selectedBorrower }) {
  return (
    <ul>
      {borrows.map((borrow) => (
        <Borrower
          borrow={borrow}
          onHandleSelectedBorrower={onHandleSelectedBorrower}
          selectedBorrower={selectedBorrower}
          key={borrow.id}
        />
      ))}
    </ul>
  );
}

function Borrower({ borrow, onHandleSelectedBorrower, selectedBorrower }) {
  const isSelected = selectedBorrower?.id === borrow.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={borrow.image} alt={borrow.id} />
      <h3>{borrow.name}</h3>
      <p style={{ color: "red" }}>Balance: {borrow.balance}</p>
      <span> Due: {borrow.date}</span>
      <Button onClick={() => onHandleSelectedBorrower(borrow)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddBorrower({ onAddNewBorrower }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) {
      alert("Empty Name, Please Fill");

      return;
    }

    const id = crypto.randomUUID();

    const newBorrower = {
      id,
      name,
      image: `${image}?=${id}`,
      date: 0 - 0 - 0,
      balance: 0,
    };

    onAddNewBorrower(newBorrower);
  }

  return (
    <form className="form-add-borrower" onSubmit={handleSubmit}>
      <label>Borrower name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Confirm</Button>
    </form>
  );
}

function FormFillOut({ selectedBorrower, onFormFillOut, onFormFillOut2 }) {
  const [amount, setAmount] = useState("");
  const [paymentDay, setPaymentDay] = useState("");
  const interest = (amount * 2) / 100 + amount;

  function handleFill(e) {
    e.preventDefault();

    if (!amount || !paymentDay) return;

    onFormFillOut(interest);
    onFormFillOut2(paymentDay);
  }

  return (
    <form className="form-fill-out" onSubmit={handleFill}>
      <h2>Lend money to {selectedBorrower.name}</h2>

      <label>💵 Amount</label>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <label>💸 Interest (2%) </label>
      <input type="text" disabled value={interest} />

      <label>🤑 Payment day</label>
      <input
        type="date"
        value={paymentDay}
        onChange={(e) => setPaymentDay(e.target.value)}
      />

      <Button>Lend</Button>
    </form>
  );
}
