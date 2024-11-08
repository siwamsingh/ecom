CREATE TABLE IF NOT EXISTS address (
    _id SERIAL PRIMARY KEY,
    specific_location VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    landmark VARCHAR(255),
    pincode VARCHAR(6) NOT NULL CHECK (pincode ~ '^\d{6}$'),
    town_or_city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL CHECK (state IN (
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
        'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
        'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Delhi',
        'Puducherry', 'Ladakh', 'Jammu and Kashmir'
    )),
    country VARCHAR(50) NOT NULL DEFAULT 'India'
);