import SearchVehicle from "./search-vehicle";
import SearchBattery from "./search-battery";

export default function SpecialistPage() {
  return (
    <div className="h-full w-full px-4">
      <h1 className="text-2xl font-bold pt-4">Welcome to Specialist Page</h1>
      <p className="text-justify pt-4">
        Welcome professionals to the Cara7 page dedicated to you. Please log in
        to connect.
      </p>
      <div className="flex flex-row justify-center items-center mt-10 space-x-4">
        <SearchVehicle />
        <SearchBattery />
      </div>
    </div>
  );
}
