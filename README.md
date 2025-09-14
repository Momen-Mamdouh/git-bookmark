
# Bookmarks-pureJs-app
An interactive web application for managing your bookmarks. This project is built with Pure JavaScript and Bootstrap 5, providing a fast, lightweight, and clean user interface.

# Features


Bookmark Management: Add, view, update, and delete bookmarks.

Persistent Data Storage: Bookmarks are saved in the browser's localStorage, with additional options to download data as CSV, JSON, or TXT files.

Advanced Search & Sorting: Find bookmarks quickly using a powerful search function and sort them by name, URL, or creation date.

Intuitive UI: A responsive, mobile-friendly design with real-time form validation and a Dark/Light mode toggle.

Data Normalization: Data is normalized for efficient searching and manipulation, with each entry assigned a unique ID using crypto.randomUUID().

Efficient DOM Updates: Optimizes performance by using document.createDocumentFragment and only updating specific elements of the DOM, rather than re-rendering the entire table.

### 📸 Screenshot:
![Dark_mode_Homepage](./screenshots/Dark_mode_HomePage.png)
![Light_mode_Homepage](./screenshots/Light_mode_HomePage.png)
![InValid_Data](./screenshots/inValid_Data.png)
![Valid_Data](./screenshots/Valid_Data.png)
![Searched_Table](./screenshots/Search_table.png)
![Sorted_Table](./screenshots/sorted_table.png)
![Add_Modal](./screenshots/Add_Modal.png)
![Cancel_Update](./screenshots/Cancel_update.png)

# Tech Stack Used:
1- Pure JavaScript which handles:
1.1_ Color_Mode where using window.matchMedia("(prefers-color-scheme: dark)") to check OS color mode and listen to any change on it to match app with.
1.2_ Data saved in localStorage as it in array of objects has {id, order, name, link, category, urlIcon, pinningFlag}.
1.3_ Each element has an id genrated by crypto.randomUUID() in js, and data is normalized to can be easily saerched for.
1.4_ Data is cached through using CachingData_class which saves data in Map with keys to easily contact with and it's sync with  any change in data.
1.5_ Data can be downloaded as CSV, JSON, TXT file to can have last updated data to be safe from any unexpected cahnge in browser storage.
1.6_ Rows can be pinned through pinning logic attached in pinningUtils.js file.
1.7_ There also sorting logic asc and desc on each line through quickSoritng algorithm (i alos define Bubble and selection sorting algorithms too).
1.8_ Search logic is defined too and alos give logic of caching for search , sort too avoid repeating same sorting or searching if the prev sort or search is the same woth current one else it'll give new search or sort.
1.9_ Dom logic hre is optimized in max way as avoided as possible any full data mainpulation at updating or adding, deleting only change the part affected , also at displaying all data all opeartions are done in documentFragment then inserted into DOM.
1.10_ Thorugh main.js i hadnle function need to each page (as it is small project) and Qoutes send to fucntion that handle display of Quotes in DOM.
1.11_ Data validation for name and url in realtime with debounce logic provided in checking to avoid excuting logic for largee unnecessary times, also Url is validated through URL built-in Api through it url is checked and also fetch for website icon through URLObj.origin/favicon.ico or logo.svg 
1.12. Img tag has icon is provided with fallback logic to avoid any brokene image through js by onerror event.

2- Bootstrap Framework for Css.
3- Fontawesome for using Webfonts (Download files attached).
4- BreeSerifr_Font (Downlaod Files attached).


📈 Logic Flowchart
This flowchart visualizes the application's core logic, detailing how user actions trigger data manipulation and UI updates.

    A[Start Application] --> B(Initialize Data from localStorage);
    B --> C{Data Exists?};
    C -- Yes --> D(Render Table with allUrls);
    C -- No --> E(Show Placeholder Table);

    D --> F[Listen to Main Events];
    E --> F;

    F --> G{Event Occurs?};

    G -- Click on `submitBtn` --> H{Mode is 'Add'?};
    H -- Yes --> I{Is Valid?};
    I -- Yes --> J(Add new URL to array);
    J --> K(Update Table);
    J --> L(Save to localStorage);

    H -- No (Mode is 'Update') --> M{Is Valid?};
    M -- Yes --> N(Update URL in array);
    N --> K(Update Table);
    N --> L(Save to localStorage);
    M -- No --> O(Show Validation Modal);

    G -- Click on `deleteBtn` --> P(Delete URL from array);
    P --> Q(Update Table);
    Q --> R(Save to localStorage);

    G -- Click on Sort dropdown --> S(Get sorting method);
    S --> T(Sort `allUrls` array);
    T --> U(Update Table with sorted data);

    G -- Input in search field --> V(Filter `allUrls` array);
    V --> W{Results Found?};
    W -- Yes --> X(Display Filtered Table);
    W -- No --> Y(Show "No Results" Modal);

    subgraph Data Flow
        direction LR
        J --- L
        N --- L
        P --- R
    end

    subgraph UI Updates
        direction LR
        K --- U
        U --- X
        X --- Y
    end



6- Animattion hadnels the (Flash_Effect , Button Pulse_Effect, Background_Gradient_Change_Effect) in qouteStyleSheet.css File.
7- react-hot-toast to display some idication for user at interacting with the page
