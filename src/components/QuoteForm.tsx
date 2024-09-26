import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";

// Schema validation for the form
const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  phone: z.string().min(1, "Phone is required."),
  address: z.string().min(1, "Address is required."),
  propertyType: z.enum(["residential", "commercial"], {
    errorMap: () => ({ message: "Please select a property type." }),
  }),
  propertySize: z.number().min(1, "Property size must be greater than zero."),
  surfaceCondition: z.number().min(1).max(5),
  additionalServices: z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const additionalServicesItems = [
  { id: 70, label: "Roof Cleaning ($70)" },
  { id: 45, label: "Driveway Cleaning ($45)" },
  { id: 35, label: "Window Cleaning ($35)" },
];

const QuoteForm = ({
  setDetails,
}: {
  setDetails: (data: FormValues) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      propertySize: 0,
      surfaceCondition: 3,
      additionalServices: [],
    },
  });

  const handleClick = (values: z.infer<typeof formSchema>) => {
    setDetails(values);
    form.reset();
  };

  return (
    <div
      className="w-full max-w-4xl rounded-lg bg-white/20 p-6 shadow-lg backdrop-blur-sm
        transition-all duration-300 ease-in-out hover:shadow-xl"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleClick)}
          className="flex flex-col gap-6 text-left"
        >
          {/* Name and Phone Fields */}
          <div className="flex flex-col md:flex-row md:gap-6">
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="h-12 rounded-lg border-none bg-white/90 text-lg text-black shadow-md
                          placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4 flex-grow md:mt-0">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your phone number"
                        type="number"
                        className="h-12 rounded-lg border-none bg-white/90 text-lg text-black shadow-md
                          placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Address Field */}
          <div className="flex-grow">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Service Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Street, City, State"
                      className="h-12 rounded-lg border-none bg-white/90 text-lg text-black shadow-md
                        placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Property Type and Property Size Fields */}
          <div className="flex flex-col md:flex-row md:gap-6">
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Property Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="h-12 rounded-lg bg-white/90 text-lg text-black shadow-md
                            placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                        >
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="pointer-events-none">
                            Property Types
                          </SelectLabel>
                          <SelectItem
                            value="residential"
                            className="cursor-pointer"
                          >
                            Residential
                          </SelectItem>
                          <SelectItem
                            value="commercial"
                            className="cursor-pointer"
                          >
                            Commercial
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4 flex-grow md:mt-0">
              <FormField
                control={form.control}
                name="propertySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Property Size (Sqft)
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Size in sqft"
                        className="h-12 rounded-lg border-none bg-white/90 text-lg text-black shadow-md
                          placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Surface Condition Slider */}
          <FormField
            control={form.control}
            name="surfaceCondition"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Surface Condition</FormLabel>
                <FormControl>
                  <Slider
                    max={5}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-full cursor-pointer"
                  />
                </FormControl>

                <div className="mt-2 text-center text-lg text-white">
                  Level: {field.value}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Additional Services */}
          <FormField
            control={form.control}
            name="additionalServices"
            render={() => (
              <FormItem>
                <FormLabel className="text-white">
                  Additional Services
                </FormLabel>

                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  {additionalServicesItems.map((service) => (
                    <FormField
                      key={service.id}
                      control={form.control}
                      name="additionalServices"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={
                                field.value?.includes(service.id) ?? false
                              }
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      service.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== service.id,
                                      ) || [],
                                    );
                              }}
                              className="border border-white"
                            />
                          </FormControl>

                          <FormLabel className="cursor-pointer text-base font-normal text-white">
                            {service.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="mt-6 h-12 w-full rounded-lg bg-blue-600 text-lg text-white shadow-md
              transition-all duration-300 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
          >
            Get Estimate
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default QuoteForm;
