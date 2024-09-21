import { useState } from "react";
import QuoteForm from "./components/QuoteForm";
import Details from "./components/Details";

function App() {
  const [details, setDetails] = useState<{
    name: string;
    phone: string;
    address: string;
    propertyType: string;
    propertySize: number;
    surfaceCondition: number;
    additionalServices?: number[];
  } | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex min-h-screen w-full items-center px-2 font-poppins text-white">
      <div className="flex size-full flex-col items-center justify-center text-center">
        <h1 className="text-7xl font-semibold uppercase">
          WELCOME TO Pro-Wash
        </h1>

        <div className="my-10">
          <h2 className="text-3xl">Get An Instant Quote:</h2>
          <p className="text-xl">
            Get your instant, no-obligation quote in under a minute. Fast, easy,
            and free!
          </p>
        </div>

        {!showDetails && (
          <QuoteForm
            setDetails={(data) => {
              setDetails(data);
              setShowDetails(true); // show details after form submission
            }}
          />
        )}

        {showDetails && details && (
          <Details
            details={details}
            onOk={() => {
              setShowDetails(false); // hide details and show form again
              setDetails(null); // clear the details
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
