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

const formSchema = z.object({
  name: z.string().min(1, "Name is required."), // Custom error message
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
    <div className="w-full max-w-4xl rounded-lg bg-white/20 p-5 backdrop-blur-sm">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleClick)}
          className="flex w-full flex-col gap-4 text-left"
        >
          <div className="flex w-full justify-between gap-4">
            <div className="w-full max-w-[380px]">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name..."
                          type="text"
                          className="text-lg text-black"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="w-full max-w-[380px]">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your phone..."
                          type="number"
                          className="text-lg text-black"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>

          <div className="w-full">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Service Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Street, City, State"
                        type="text"
                        className="text-lg text-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="flex w-full justify-between gap-4">
            <div className="w-full max-w-[380px]">
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-lg text-black">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Property Types:</SelectLabel>
                            <SelectItem value="residential">
                              Residential
                            </SelectItem>
                            <SelectItem value="commercial">
                              Commercial
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="w-full max-w-[380px]">
              <FormField
                control={form.control}
                name="propertySize"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Property Size</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Sqft"
                          type="number"
                          className="text-lg text-black"
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
                  );
                }}
              />
            </div>
          </div>

          <div className="w-full">
            <FormField
              control={form.control}
              name="surfaceCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surface Condition</FormLabel>
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
          </div>

          <div className="w-full">
            <FormField
              control={form.control}
              name="additionalServices"
              render={() => (
                <FormItem>
                  <FormLabel>Additional Services</FormLabel>
                  <div className="flex justify-between gap-4">
                    {additionalServicesItems.map((service) => (
                      <FormField
                        key={service.id}
                        control={form.control}
                        name="additionalServices"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
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
                            <FormLabel className="cursor-pointer text-base font-normal">
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
          </div>

          <Button
            type="submit"
            className="mt-5 h-12 w-full bg-blue-500 text-lg transition-colors hover:bg-blue-600"
          >
            Get Estimate
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default QuoteForm;
