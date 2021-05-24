import Button from "./components/Button";

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        height: 600
      }}
    >
      <Button btnColor="blue" type="outline">
        Outline Button
      </Button>
    </div>
  );
}
