node -v
v22.11.0

npm i
npx expo start -c --tunnel

**_Resources_**

gluestack-ui v2 offers customizable, beautifully designed components for your projects. Unlike traditional libraries, it's not a pre-packaged dependency. Choose the components you need and copy-paste them directly into your React, Next.js & React Native projects.
https://gluestack.io/ui/docs/home/getting-started/installation

One time password, security, password icon
https://www.flaticon.com/free-icons/otp

React Native countdown timer component in a circle shape with color and progress animation.
https://www.npmjs.com/package/react-native-countdown-circle-timer

https://www.youtube.com/watch?v=zLdQxQX5nAs&list=PLswiMBSI75YtSVBBKUYY4dC20hQJ7OdAz&index=13

Free images Unsplash.com

react native image picker
npm i react-native-image-picker
https://www.npmjs.com/package/react-native-image-picker

redux
npm install @reduxjs/toolkit react-redux

react native elements
https://reactnativeelements.com/

icons
https://www.iconfinder.com/

to incorporate svg images
npm install react-native-svg
https://www.npmjs.com/package/react-native-svg
npm i react-native-svg-transformer

react-native-curved-bottom-bar
https://www.npmjs.com/package/react-native-curved-bottom-bar

This package can be used as a drop-in replacement for react-native-svg when targeting the web,
https://www.npmjs.com/package/react-native-svg-web

redis
https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-linux/

refresh
https://youtu.be/AcYF18oGn6Y

https://www.youtube.com/watch?v=xjMP0hspNLE

method of payment
https://youtu.be/JWXKv6D3SxM?si=gsLD723hFf4NsjUB

reverse geo code
https://youtu.be/d7G0E_9FwyE

refreshing page
https://www.youtube.com/watch?v=kU0VGgcBmwg

flatlist refreshing
https://www.youtube.com/watch?v=2-sr2e7LYhM

react-native-reanimated-carousel
https://rn-carousel.dev/Examples/custom-animations/blur-parallax
https://github.com/dohooo/react-native-reanimated-carousel/blob/main/example/app/app/demos/custom-animations/blur-parallax/index.tsx

**_Documentation_**

allows us to dismiss the keyboard with a touch on the screen
<TouchableWithoutFeedback onPress={Keyboard.dismiss}></TouchableWithoutFeedback>

running on linux: sudo snap services redis

you only use dispatch() when you're calling an actual Redux action or thunk that’s meant to:

Update the Redux state

Trigger side effects (e.g., via createAsyncThunk)

Communicate with the reducer

✅ DO use dispatch when you're doing something like this:

dispatch(setAuctionList(data)); // updates state
dispatch(fetchAuctions()); // thunk to fetch data

❌ DON'T use dispatch for regular helper functions like:

createAuction(state); // just sends data through WebSocket

To check for unused packages
Automated Tools
Using depcheck (Recommended)
depcheck is a tool that analyzes dependencies in a project to find unused or missing packages.

Install depcheck globally or locally:

bash
npm install -g depcheck
or

bash
npx depcheck
Run depcheck in your project root:

bash
depcheck
This will list:

Unused dependencies (packages installed but not imported).

Missing dependencies (packages used but not installed).

Unused devDependencies.

Using npm-check
npm-check provides an interactive way to review outdated, unused, and missing dependencies.

Install it:

bash
npm install -g npm-check
Run it:

bash
npm-check
It will show unused packages in an interactive UI.

**Terms of Service**  
Welcome to QuickAuct. These Terms of Service govern your use of our Application and services.  
By accessing or using our Application, you agree to comply with these terms.

**1. Acceptance of Terms**  
By accessing or using our Application, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Application.

**2. Eligibility**  
You must be at least 18 years old to use our Application or participate in auctions. By using our Application, you represent and warrant that you are at least 18 years old.

**3. Registration**  
To participate in auctions, you may be required to register an account with us. You agree to provide accurate and complete information during the registration process and to keep your account information up to date.

**4. Bidding and Purchases**  
Bidding on items in our auctions constitutes a binding contract to purchase the item if you are the winning bidder. All sales are final, and bids cannot be retracted once placed.

**5. Payment**  
Winning bidders are required to make payment for their purchases within the specified timeframe. Failure to make timely payment may result in cancellation of the transaction and suspension of your account.

**6. Shipping and Pickup**  
Buyers are responsible for arranging shipping or pickup of their purchases. We may provide assistance in coordinating shipping, but ultimately, it is the buyer’s responsibility to ensure their items are received.

**7. Prohibited Conduct**  
You agree not to engage in any conduct that violates these Terms of Service or any applicable laws or regulations. This includes but is not limited to:

- Using our Application for any unlawful purpose.
- Interfering with the operation of our Application.
- Posting or transmitting unauthorized content.
- Impersonating another person or entity.

**8. Intellectual Property**  
All content on our Application, including text, graphics, logos, and images, is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or transmit any content from our Application without our prior written consent.

If you're on a Mac and developing for iOS, you need to install the pods (via Cocoapods) to complete the linking.
npx pod-install ios

axios
npm install axios

React-native-encryted-storage
npm install react-native-encrypted-storage
React Native wrapper around SharedPreferences and Keychain to provide a secure alternative to Async Storage.
https://www.npmjs.com/package/react-native-encrypted-storage

[Violation] 'setInterval' handler took 52ms

1. Debounce or limit updates
   Instead of updating every 1 second globally, track ends_at timestamps and calculate remaining time dynamically in the card:

const remainingTime = useMemo(() => {
const diff = new Date(auction.ends_at) - Date.now();
return Math.max(0, Math.floor(diff / 1000));
}, [auction.ends_at, Date.now()]);

This avoids state updates every second and keeps UI smoother.

bids: <FontAwesome5 name="gavel" size={90} color={COLORS.primary} />,
sales: <FontAwesome5 name="store" size={90} color={COLORS.primary} />,
likes: <FontAwesome name="heart" size={90} color={COLORS.primary} />,

npx expo install react-native-reanimated-carousel react-native-image-viewing react-navigation react-native-gesture-handler react-native-reanimated

why is setSelectedCategory undefine at categoryfilter component?

ListHeaderComponent={
<RenderFlatListHeader
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
}

const RenderFlatListHeader = ({ selectedCategory, setSelectedCategory }) => {
return (
<>
<CategoriesFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
<View style={styles.sectionHeader}>
<Text style={styles.sectionTitle}>Newest Items</Text>
<Text style={styles.filterText}>Filters</Text>
</View>
</>
);
};

icons
https://fontawesome.com/v4/icons/

logo
https://logo.com/
https://looka.com/
logomaker.com

vzero ai
bolt ai

toast
https://www.youtube.com/watch?v=6OkKgCPADoU
https://www.youtube.com/watch?v=uHlB4w4gTHY


google plsy store
https://www.youtube.com/watch?v=7DQbbTQpUjQ&list=PLk8gdrb2DmCjsRsDIwMBJdf350qKMiJ8R&index=1