function formatPrice(amount) {
    // Ensure the amount is a number
    if (isNaN(amount)) {
        throw new Error('The provided value is not a number');
    }

    // Convert the amount to a number with two decimal points
    const formattedAmount = amount.toFixed(2);

    // Return the formatted price string with a dollar sign
    return `$${formattedAmount}`;
}

export default formatPrice