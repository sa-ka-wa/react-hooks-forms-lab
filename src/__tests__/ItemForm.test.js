import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ItemForm from "../components/ItemForm";
import Filter from "./Filter";
import App from "../components/App";

// Test if the callback is called when the form is submitted
test("calls the onItemFormSubmit callback prop when the form is submitted", () => {
  const onItemFormSubmit = jest.fn(); // Mock function
  render(<ItemForm onItemFormSubmit={onItemFormSubmit} />);

  fireEvent.change(screen.queryByLabelText(/Name/), {
    target: { value: "Ice Cream" },
  });
  fireEvent.change(screen.queryByLabelText(/Category/), {
    target: { value: "Dessert" },
  });
  fireEvent.submit(screen.queryByText(/Add to List/)); // Submit the form

  expect(onItemFormSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      id: expect.any(String),
      name: "Ice Cream",
      category: "Dessert",
    })
  );
});

// Test if a new item is added to the list after form submission
test("adds a new item to the list when the form is submitted", () => {
  render(<App />);

  const dessertCount = screen.queryAllByText(/Dessert/).length; // Get initial count of Dessert items

  // Change form fields to simulate user input
  fireEvent.change(screen.queryByLabelText(/Name/), {
    target: { value: "Ice Cream" },
  });
  fireEvent.change(screen.queryByLabelText(/Category/), {
    target: { value: "Dessert" },
  });

  fireEvent.submit(screen.queryByText(/Add to List/)); // Submit the form

  expect(screen.queryByText(/Ice Cream/)).toBeInTheDocument(); // Check if Ice Cream is added to the list
  expect(screen.queryAllByText(/Dessert/).length).toBe(dessertCount + 1); // Ensure the count of Dessert items increased
});

// Test for filtering based on the search term (full match)
test("filters based on the search term to include full matches", () => {
  render(<Filter />);

  // Simulate entering a search term
  fireEvent.change(screen.queryByPlaceholderText(/Search/), {
    target: { value: "Yogurt" },
  });

  // Check that the item is visible or hidden based on search
  expect(screen.queryByText("Yogurt")).toBeInTheDocument();
  expect(screen.queryByText("Lettuce")).not.toBeInTheDocument(); // Ensure Lettuce is hidden after search
});

// Test for partial match filtering
test("filters based on the search term to include partial matches", () => {
  render(<Filter />);

  fireEvent.change(screen.queryByPlaceholderText(/Search/), {
    target: { value: "Cheese" },
  });

  // Ensure partial matches are visible
  expect(screen.queryByText("Swiss Cheese")).toBeInTheDocument();
  expect(screen.queryByText("String Cheese")).toBeInTheDocument();
  expect(screen.queryByText("Lettuce")).not.toBeInTheDocument(); // Ensure non-matching items are excluded
  expect(screen.queryByText("Yogurt")).not.toBeInTheDocument(); // Ensure non-matching items are excluded
});
