# Project Documentation

## ISO Standards Implementation

This project adheres to **ISO standards**, specifically regarding date and time representation.

### ISO 8601 - Date and Time Format
All date and time representations in the Frontend and Backend APIs follow the **ISO 8601** standard (`YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ss.sssZ`).

#### Implementation Details:

1.  **Backend (Laravel)**:
    *   Database columns for dates store timestamps in standard SQL format.
    *   API responses return dates as ISO 8601 strings (e.g., `2025-12-07T16:45:00.000000Z`).
    *   Models are configured to serialize dates correctly.

2.  **Frontend (React)**:
    *   **Data Display**: In tables and lists (e.g., Transaction History), dates are displayed in the strictly numeric ISO format `YYYY-MM-DD` (e.g., `2025-12-07`) to avoid ambiguity.
    *   **Data Processing**: Grouping logic (e.g., for Sales Charts) parses the ISO string to ensure accurate daily aggregation, independent of local timezones.

### Benefits
*   **Consistency**: Ensures uniform date representation across all system components.
*   **Interoperability**: Facilitates easy data exchange between backend, frontend, and external systems.
*   **Clarity**: Eliminates confusion caused by different local date formats (e.g., MM/DD/YYYY vs DD/MM/YYYY).

### Additional ISO Standards Applied

#### 1. ISO 4217 - Currency & Transaction Nominals
*   **Application**: Defines the standard for the currency used in all transaction nominals.
*   **Currency Code**: **IDR** (Indonesian Rupiah).
*   **Numeric Code**: **360**.
*   **Minor Unit (Exponent)**: **2**.
    *   *Implementation*: Transaction amounts are stored in the database with 2 decimal precision (`DECIMAL(10,2)`), complying with the ISO minor unit definition for IDR, although the application display may round to integers for visual simplicity in the `id-ID` locale.
*   **Display format**: `Rp` prefix with thousand separators (e.g., `Rp 50.000`), adhering to local standards derived from the currency ISO definition.

    > **Handling Redenomination (Redenominasi)**:
    > In the event of an official currency redenomination (e.g., `Rp 1.000` becoming `Rp 1`), the system adheres to ISO guidelines:
    > 1.  **New ISO Code**: Adopt the new ISO 4217 currency code if assigned (e.g., `IDR` -> `IDN`).
    > 2.  ** exponent Update**: Adjust the minor unit exponent as defined by the new standard.
    > 3.  **Data Migration**: A database migration will be executed to convert historical nominals to the new value using the official conversion rate, ensuring data integrity and continuity.

#### 2. ISO 639-1 & ISO 3166-1 - Language and Country Codes
*   **Implementation**: The application uses the **`id-ID`** locale identifier for formatting dates, numbers, and currencies.
    *   **ISO 639-1**: `id` (Indonesian language).
    *   **ISO 3166-1**: `ID` (Indonesia country region).

#### 3. ISO/IEC 21778 - JSON Format
*   **Implementation**: API communication between Backend and Frontend strictly utilizes the **JSON** (JavaScript Object Notation) format for data interchange.

#### 4. ISO/IEC 10646 - Character Encoding (Universal Coded Character Set)
*   **Implementation**: The Database and Application serve content using **UTF-8** encoding, ensuring support for a wide range of characters and symbols.
