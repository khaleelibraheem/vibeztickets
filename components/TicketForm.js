import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateTicketData } from "../utils/validation";

export function TicketForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    event: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateTicketData(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
    setFormData({ name: "", phone: "", event: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Card className="sm:max-w-[500px]">
      <CardHeader>
        <CardTitle>Create New Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              aria-label="Name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              aria-label="Phone Number"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <Input
              name="event"
              placeholder="Event Name"
              value={formData.event}
              onChange={handleChange}
              aria-label="Event Name"
              className={errors.event ? "border-red-500" : ""}
            />
            {errors.event && (
              <p className="text-red-500 text-sm mt-1">{errors.event}</p>
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Ticket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
