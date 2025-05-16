// State update handlers
export const handleSelectCategory = (value) => {
  const category = parseInt(value);
  // Merge updates
  setState((prevState) => ({ ...prevState, category }));
};

export const handleSelectItemCondition = (item_condition) => {
  // Merge updates
  setState((prevState) => ({ ...prevState, item_condition }));
};

export const handleSelectDelivery = (shipping_details) => {
  // Merge updates
  setState((prevState) => ({ ...prevState, shipping_details }));
};

export const handleSelectIncreaseAmount = (value) => {
  const bid_increment = parseInt(value);
  // Merge updates
  setState((prevState) => ({ ...prevState, bid_increment }));
};

export const handleUpdTitle = (title) => {
  // Merge updates
  const cleanedTitle = title.replace(/\s+/g, " ").trim();
  setState((prevState) => ({ ...prevState, title: cleanedTitle }));
};

export const handleUpdDescrip = (description) => {
  // Merge updates
  const cleanedDescription = description.replace(/\s+/g, " ").trim();
  setState((prevState) => ({
    ...prevState,
    description: cleanedDescription,
  }));
};

export const handleUpdStartingPrice = (value) => {
  const starting_price = parseInt(value);
  // Merge updates
  setState((prevState) => ({ ...prevState, starting_price }));
};

export const updateStateDuration = (fieldIndex, value) => {
  setState((prev) => {
    const durationItem = duration.find(
      (item) => item.type === selectedDuration
    );

    if (!durationItem) return prev;

    const updatedValues = durationItem.values.map((v, i) =>
      i === fieldIndex ? value : v
    );

    const sanitized = updatedValues.map((v) => {
      const num = parseInt(v);
      return isNaN(num) ? 0 : num;
    });

    return {
      ...prev,
      end_time: sanitized,
    };
  });
};
