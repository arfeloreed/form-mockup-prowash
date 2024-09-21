import Swal from "sweetalert2";

interface DetailsProps {
  details: {
    name: string;
    phone: string;
    address: string;
    propertyType: string;
    propertySize: number;
    surfaceCondition: number;
    additionalServices?: number[];
  };
  onOk: () => void;
}

const additionalServicesItems = [
  { id: 70, label: "Roof Cleaning ($70)" },
  { id: 45, label: "Driveway Cleaning ($45)" },
  { id: 35, label: "Window Cleaning ($35)" },
];

const Details = ({ details, onOk }: DetailsProps) => {
  const {
    name,
    phone,
    address,
    propertyType,
    propertySize,
    surfaceCondition,
    additionalServices,
  } = details;
  const formAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  let multiplier = 0;

  switch (surfaceCondition) {
    case 1:
      multiplier = 2;
      break;
    case 2:
      multiplier = 4;
      break;
    case 3:
      multiplier = 5;
      break;
    case 4:
      multiplier = 7;
      break;
    case 5:
      multiplier = 9;
      break;
    default:
      break;
  }

  // calculate the total cost for additional services if they are defined
  const additionalServicesCost = additionalServices
    ? additionalServices
        .map((serviceId) => {
          const service = additionalServicesItems.find(
            (item) => item.id === serviceId,
          );
          return service ? service.id : 0;
        })
        .reduce((acc, curr) => acc + curr, 0)
    : 0; // if undefined, default to 0

  // calculate the total estimated price
  const estimatedPrice = multiplier * propertySize + additionalServicesCost;

  const data = {
    name: name,
    mobile: phone,
    address: address,
    propertyType: propertyType,
    propertySize: propertySize,
    surfaceCondition: surfaceCondition,
    additionalServices: additionalServices,
    totalCost: estimatedPrice,
  };

  const handleClick = async () => {
    const formData = new FormData();

    formData.append("access_key", formAccessKey);
    // append the form data (you can add as many fields as you need)
    formData.append("name", data.name);
    formData.append("mobile", data.mobile);
    formData.append("address", data.address);
    formData.append("propertyType", data.propertyType);
    formData.append("propertySize", data.propertySize.toString());
    formData.append("surfaceCondition", data.surfaceCondition.toString());
    // for the additional services array, you can append them as a string or join them
    formData.append(
      "additionalServices",
      data.additionalServices?.join(", ") || "None",
    );
    // append total cost
    formData.append("totalCost", data.totalCost.toString());

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      }).then((res) => res.json());

      if (res.success) {
        Swal.fire({
          title: "Success!",
          text: "Thank you for availing our service!",
          icon: "success",
        });
        onOk();
      } else {
        console.error("Data submission failed", res);
      }
    } catch (err) {
      console.error("Error submitting the data. ", err);
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-lg bg-white/20 p-6 shadow-lg backdrop-blur-sm">
      {/* Name and Contact */}
      <div className="mb-4 border-b pb-4">
        <h1 className="mb-2 text-4xl font-bold text-blue-600">{name}</h1>
        <p className="text-lg text-white">{phone}</p>
        <p className="text-lg text-white">{address}</p>
      </div>

      {/* Property Info */}
      <div className="mb-4 space-y-2 border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-100">
          Property Information
        </h2>
        <p className="text-lg text-white">Type: {propertyType}</p>
        <p className="text-lg text-white">Size: {propertySize} sqft</p>
        <p className="text-lg text-white">
          Surface Condition: {surfaceCondition}
        </p>
      </div>

      {/* Additional Services */}
      <div className="mb-4 space-y-2 border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-100">
          Additional Services
        </h2>
        {additionalServices && additionalServices.length > 0 ? (
          <ul className="list-inside list-disc text-white">
            {additionalServices.map((serviceId) => {
              const service = additionalServicesItems.find(
                (item) => item.id === serviceId,
              );
              return service ? <li key={serviceId}>{service.label}</li> : null;
            })}
          </ul>
        ) : (
          <p className="text-white">No additional services selected</p>
        )}
      </div>

      {/* Final Estimated Price */}
      <div className="mt-6 rounded-lg bg-blue-100 p-4 text-center">
        <h2 className="text-2xl font-bold text-blue-800">Estimated Price</h2>
        <p className="text-3xl font-bold text-blue-600">${estimatedPrice}</p>
      </div>

      {/* OK Button */}
      <button
        onClick={handleClick}
        className="mt-6 w-full rounded bg-blue-500 py-3 font-semibold text-white transition-colors
          hover:bg-blue-600"
      >
        OK
      </button>
    </div>
  );
};

export default Details;
