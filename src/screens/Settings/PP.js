import React from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text,
  Alert,
  TouchableOpacity
} from 'react-native';
import NavStyles from '../../constants/AppStyles'



export default class PrivacyPolicy extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Privacy Policy',
    headerStyle: { backgroundColor: NavStyles.colors.background },
    headerTitleStyle: { color: NavStyles.colors.headerText },
    headerTintColor: NavStyles.colors.headerTint,
  });


  render() {
    
		return (
        <View style={styles.heroContainer}>
            <Text style={styles.heroTitle}>
                
            </Text>
            <Text style={styles.heroSubtitle}>The website located at https://www.cleat-street.com ("Website") is owned and operated by Cleat Street Incorporated (the "Company"). We created this Privacy Policy ("Policy") to demonstrate our commitment to protecting your privacy and your personally identifiable information on our Website.

This Policy is based on the principles of notice/awareness, choice/consent, access/participation and integrity/security in the collection and use of all information regarding our users and their activities on the Website. In this document "You" shall refer to you, the end user of this site, whether as an individual, entity, company, organization or related. "We", the "Website", and/or the "Company", refers to the information, services, and other provisions by the Company, or located at the Website, or by individuals and entities associated with the Website.

​           </Text>
<Text style={styles.heroTitle}>
A. Notice
                </Text>
                <Text style={styles.heroSubtitle}>This Policy notifies you of, among other things: (i) what information we gather from you, (ii) how we may use or disclose that information, (iii) with whom the information may be shared, (iv) what choices are available to you regarding collection, use and distribution of the information, (v) our efforts to protect the information, and (vi) how you can correct any inaccuracies in the information you provide to us. Please read this Policy carefully.

​</Text>
<Text style={styles.heroTitle}>
B. Google Analytics
                </Text>
                <Text style={styles.heroSubtitle}>We use a tool called “Google Analytics” to collect information about use of this site. Google Analytics collects information such as how often users visit this site, what pages they visit when they do so, and what other sites they used prior to coming to this site. We use the information we get from Google Analytics only to improve this site. Google Analytics collects only the IP address assigned to you on the date you visit this site, rather than your name or other identifying information. We do not combine the information collected through the use of Google Analytics with personally identifiable information. Although Google Analytics plants a permanent cookie on your web browser to identify you as a unique user the next time you visit this site, the cookie cannot be used by anyone but Google. Google’s ability to use and share information collected by Google Analytics about your visits to this site is restricted by the Google Analytics Terms of Use (as amended for government websites) and the Google Privacy Policy. You can prevent Google Analytics from recognizing you on return visits to this site by disabling cookies on your browser.</Text>

                <Text style={styles.heroTitle}>
                C. Types of Information
                </Text>
                <Text style={styles.heroTitle}>a. Information Submitted by You</Text>
                <Text style={styles.heroSubtitle}>We do not request you to submit any information to the Website. Any communications, emails, or other information submitted by You to the website, or individuals related to the site is solely at your own election. The website has no responsibility or other obligation to store, maintain, respond or otherwise with respect to the information transmitted to the Website by you.</Text>

                <Text style={styles.heroTitle}>b. Information Collected by Cookies</Text>
                <Text style={styles.heroSubtitle}>The Website uses "cookies" to help you use our services more easily. A "cookie" is a small data file that a website can send to your browser, which may then be stored on your computer to help our Website "remember" information about you to make it easier and more efficient for you to use our Website.

​

Our Website also employs session cookies. A session cookie does not remain on your computer after you close your web browser window. Our session cookies contain none of your personal information and cannot be used to track you around the Internet. Our session cookies can only be used by this Website and they only exist for the duration of your visit.

​

Depending on the settings in your browser, you may have the option to deny the use of cookies; however, doing so may negatively impact upon the performance of the Website or restrict us in better serving your needs and interests. The "help" portion of the toolbar on most browsers will tell you how to prevent your browser from accepting new cookies, how to have the browser notify you when you receive a new cookie, or how to disable cookies altogether.</Text>


<Text style={styles.heroTitle}>
D. Use of Information
                </Text>
                <Text style={styles.heroTitle}>a. Use of Your Information</Text>
                <Text style={styles.heroSubtitle}>Any information supplied by you is used to improve your experience, process and personalize your requests, improve the Website, develop new features, for support, and may be used for other purposes as stated herein.

​

We may also use the information to show you a history of your activity, to provide you with statistics about you or your use of our product or service, or to provide you with a better user experience.

The information collected may also be used to provide relevant advertisements, promotional messages and materials, or any other way as the Company deems fit. Currently, the only information stores by the Website is your name and email.

​

We may also retain your Data on a secure server and use this information in an aggregated form to measure number of visits, average time spent on the Website, pages viewed, and other relevant statistics.</Text>


<Text style={styles.heroTitle}>b. Disclosure of Your Information</Text>
                <Text style={styles.heroSubtitle}>The information we collect will only be collected upon your consent to this privacy policy.

We will not share your information with third parties. However, the Company reserves the right to disclose your personally identifiable information as required by law and when the Company believes that disclosure is necessary to protect the rights of the Company, and/or to comply with any judicial proceeding, court order, subpoena, or legal process served upon the Company.</Text>

<Text style={styles.heroTitle}>c. Managing Your Information</Text>
                <Text style={styles.heroSubtitle}>You are entitled to removal of your Data from our database upon request. You may request us to correct, modify or delete all of your Data collected by us through the Website, by making such a request or a related inquiry. Unless you require us to delete your Data, we will keep your information for as long as reasonably necessary for the purposes described in this Policy and for us to keep appropriate archives for our business operations.</Text>


                <Text style={styles.heroTitle}>d. Anonymous Data Collection</Text>
                <Text style={styles.heroSubtitle}>We may anonymize and aggregate data from your usage of the Website to obtain or provide general statistics regarding the use of the Website and its specific features and functionalities that you use.</Text>

                <Text style={styles.heroTitle}>E. Website Security</Text>
                <Text style={styles.heroSubtitle}>The Company employs technical safeguards to secure the Website against misuse. Regardless of the precautions taken by us we cannot ensure or warrant the security of any information you transmit to us, and you transmit such information at your own risk.</Text>

                <Text style={styles.heroTitle}>F. Acceptance of Privacy Policy</Text>
                <Text style={styles.heroSubtitle}>By using this Website, you agree to this Privacy Policy. We reserve the right, at our discretion, to change, modify, add, and or remove portions of this Privacy Policy at any time. All changes shall take effect immediately upon their posting on our Website. Your continued use of Website or acceptance of emails following the posting of changes to this Privacy Policy shall mean that you accept any and all such changes.</Text>

        </View>
				
		)
	}
}


const styles = StyleSheet.create({
    heroContainer: {
      flex: 1,
      backgroundColor: 'white',
      borderColor: '#ccc',
      margin: 10,
    },

    heroTitle: {
      color: 'black',
      fontSize: 16,
    },
    heroSubtitle: {
      color: '#999',
      fontSize: 14,
      paddingBottom: 10
    }
    })