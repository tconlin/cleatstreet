import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import NavStyles from '../../../constants/AppStyles';

export default class Terms extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Terms & Conditions',
    headerStyle: { backgroundColor: NavStyles.colors.background },
    headerTitleStyle: { color: NavStyles.colors.headerText },
    headerTintColor: NavStyles.colors.headerTint,
  });



  render() {

	return (
    <View>
        <ScrollView>
            <View style={styles.heroContainer}>
            <Text style={styles.heroTitle}>
            Welcome to Cleat Street Incorporated
            </Text>
            <Text style={styles.heroSubtitle}>These terms and conditions outline the rules and regulations for the use of Cleat Street Incorporated's Website.
            By accessing this website we assume you accept these terms and conditions in full. Do not continue to use Cleat Street Incorporated's website if you do not accept all of the terms and conditions stated on this page.
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and any or all Agreements: “Client”, “You” and “Your” refers to you, the person accessing this website and accepting the Company’s terms and conditions. “The Company”, “Ourselves”, “We”, “Our” and “Us”, refers to our Company. “Party”, “Parties”, or “Us”, refers to both the Client and ourselves, or either the Client or ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner, whether by formal meetings of a fixed duration, or any other means, for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services/products, in accordance with and subject to, prevailing law of . Any use of the above terminology or other words in the singular, plural, capitalisation and/or he/she or they, are taken as interchangeable and therefore as referring to same.</Text>

            <Text style={styles.heroTitle}>
            Cookies
            </Text>
            <Text style={styles.heroSubtitle}>We employ the use of cookies. By using Cleat Street Incorporated's website you consent to the use of cookies in accordance with Cleat Street Incorporated’s privacy policy.
            Most of the modern day interactive web sites use cookies to enable us to retrieve user details for each visit. Cookies are used in some areas of our site to enable the functionality of this area and ease of use for those people visiting. Some of our affiliate / advertising partners may also use cookies.
            </Text>
            <Text style={styles.heroTitle}>
            License
            </Text>
            <Text style={styles.heroSubtitle}>Unless otherwise stated, Cleat Street Incorporated and/or it’s licensors own the intellectual property rights for all material on Cleat Street Incorporated. All intellectual property rights are reserved. You may view and/or print pages from http://www.cleat-street.com/ for your own personal use subject to restrictions set in these terms and conditions.

            You must not:

            Republish material from http://www.cleat-street.com/
            Sell, rent or sub-license material from http://www.cleat-street.com/
            Reproduce, duplicate or copy material from http://www.cleat-street.com/
            Redistribute content from Cleat Street Incorporated (unless content is specifically made for redistribution).</Text>
            <Text style={styles.heroTitle}>
            Hyperlinking to our Content
            </Text>
            <Text style={styles.heroSubtitle}>The following organizations may link to our Web site without prior written approval:
            Government agencies;
            Search engines;
            News organizations;
            Online directory distributors when they list us in the directory may link to our Web site in the same manner as they hyperlink to the Web sites of other listed businesses; and
            Systemwide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.
            These organizations may link to our home page, to publications or to other Web site information so long as the link: (a) is not in any way misleading; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party's site.
            We may consider and approve in our sole discretion other link requests from the following types of organizations:
            commonly-known consumer and/or business information sources such as Chambers of Commerce, American Automobile Association, AARP and Consumers Union;
            dot.com community sites;
            associations or other groups representing charities, including charity giving sites,
            online directory distributors;
            internet portals;
            accounting, law and consulting firms whose primary clients are businesses; and
            educational institutions and trade associations.
            We will approve link requests from these organizations if we determine that: (a) the link would not reflect unfavorably on us or our accredited businesses (for example, trade associations or other organizations representing inherently suspect types of business, such as work-at-home opportunities, shall not be allowed to link); (b)the organization does not have an unsatisfactory record with us; (c) the benefit to us from the visibility associated with the hyperlink outweighs the absence of ; and (d) where the link is in the context of general resource information or is otherwise consistent with editorial content in a newsletter or similar product furthering the mission of the organization.

            These organizations may link to our home page, to publications or to other Web site information so long as the link: (a) is not in any way misleading; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and it products or services; and (c) fits within the context of the linking party's site.

            If you are among the organizations listed in paragraph 2 above and are interested in linking to our website, you must notify us by sending an e-mail to info@cleat-street.com. Please include your name, your organization name, contact information (such as a phone number and/or e-mail address) as well as the URL of your site, a list of any URLs from which you intend to link to our Web site, and a list of the URL(s) on our site to which you would like to link. Allow 2-3 weeks for a response.

            Approved organizations may hyperlink to our Web site as follows:

            By use of our corporate name; or
            By use of the uniform resource locator (Web address) being linked to; or
            By use of any other description of our Web site or material being linked to that makes sense within the context and format of content on the linking party's site.
            No use of Cleat Street Incorporated’s logo or other artwork will be allowed for linking absent a trademark license agreement.</Text>

            <Text style={styles.heroTitle}>
            Iframes
            </Text>
            <Text style={styles.heroSubtitle}>Without prior approval and express written permission, you may not create frames around our Web pages or use other techniques that alter in any way the visual presentation or appearance of our Web site.</Text>

            <Text style={styles.heroTitle}>
            Reservation of Rights
            </Text>
            <Text style={styles.heroSubtitle}>We reserve the right at any time and in its sole discretion to request that you remove all links or any particular link to our Web site. You agree to immediately remove all links to our Web site upon such request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuing to link to our Web site, you agree to be bound to and abide by these linking terms and conditions.

            </Text>
            <Text style={styles.heroTitle}>
            Content Liability
            </Text>
            <Text style={styles.heroSubtitle}>We shall have no responsibility or liability for any content appearing on your Web site. You agree to indemnify and defend us against all claims arising out of or based upon your Website. No link(s) may appear on any page on your Web site or within any context containing content or materials that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.

            </Text>
            <Text style={styles.heroTitle}>
            Disclaimer
            </Text>
            <Text style={styles.heroSubtitle}>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website (including, without limitation, any warranties implied by law in respect of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill). Nothing in this disclaimer will:

            limit or exclude our or your liability for death or personal injury resulting from negligence;
            limit or exclude our or your liability for fraud or fraudulent misrepresentation;
            limit any of our or your liabilities in any way that is not permitted under applicable law; or
            exclude any of our or your liabilities that may not be excluded under applicable law.
            The limitations and exclusions of liability set out in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer or in relation to the subject matter of this disclaimer, including liabilities arising in contract, in tort (including negligence) and for breach of statutory duty.

            To the extent that the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</Text>
            <Text style={styles.heroTitle}>
            Contact Information
            </Text>
            <Text style={styles.heroSubtitle}>If you have any queries regarding any of our terms, please contact us.</Text>

            
        </View>
    </ScrollView>
    <View style={styles.NavBox}> 
    <TouchableOpacity onPress={this.props.change('register')}>
        <Text style={styles.backText}>{'<'} Register</Text>
    </TouchableOpacity>
</View>	
</View>
		)
	}
}


const styles = StyleSheet.create({
backText: {
    paddingLeft: 15,
    paddingBottom: 10,
    color:  NavStyles.colors.headerText

},
NavBox: {
    position: 'absolute',
    bottom: 0,
    height: 75,
    justifyContent: 'center',
    width: '100%',
    backgroundColor:  NavStyles.colors.background,
    borderTopWidth: 2,
    borderTopColor: '#fff'
},

heroContainer: {
  flex: 1,
  backgroundColor: 'white',
  borderColor: '#ccc',
  paddingBottom: 80
},

heroTitle: {
  color: 'black',
  fontSize: 20,
  paddingBottom: 5,
  paddingTop: 30,
  margin: 30,
},
heroSubtitle: {
  color: '#999',
  fontSize: 14,
  paddingBottom: 10,
  margin: 30,
}
})