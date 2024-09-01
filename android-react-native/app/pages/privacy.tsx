import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles/styles';
import BackHeader from '../components/back_header';
import { ScrollView } from 'react-native-gesture-handler';

export default function Privacy() {
    const navigator = useNavigation();

    return (
        <View style={[styles.flexTop, styles.background]}>
            <BackHeader>
                <Text style={[styles.largeText, styles.bold, {fontSize: 24, fontWeight: 600}]}>Privacy Policy</Text>
            </BackHeader>
            <ScrollView style={styles.container}>
                <Text style={[styles.largeText, styles.paragraph]}>Lorem ipsum dolor</Text>
                <Text style={[styles.text, styles.paragraph]}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ultrices suscipit ante sed suscipit. Quisque elementum elit diam, non tincidunt mi gravida ut. Donec in nunc porttitor, tincidunt ligula tristique, hendrerit neque. Cras sed sem sed velit pellentesque sagittis non ac justo. Sed ullamcorper risus ac mi semper egestas. Mauris nec efficitur lectus. Suspendisse faucibus efficitur ipsum, sed pharetra est malesuada aliquet. Vestibulum lacinia urna nec eros mattis consectetur. Nunc efficitur dui nec dolor tincidunt, non dapibus neque laoreet. Pellentesque pellentesque, elit non sodales placerat, nulla lorem dictum enim, quis mollis magna ligula at purus.
                </Text>
                <Text style={[styles.largeText, styles.paragraph]}>Proin sit amet tincidunt ligula</Text>
                <Text style={[styles.text, styles.paragraph]}>
                    Proin sit amet tincidunt ligula. In malesuada efficitur erat et tincidunt. In hac habitasse platea dictumst. Proin sit amet fringilla metus. Donec vulputate vel libero a auctor. Nam tempor justo eget quam euismod rutrum. Cras non volutpat eros. Curabitur sed ligula risus. Suspendisse viverra lorem id neque facilisis, sit amet lacinia mauris eleifend. Suspendisse et est suscipit, tincidunt enim vel, finibus felis. Vestibulum a magna fringilla, blandit lacus a, placerat ipsum. Duis porttitor lacus eu ante interdum, vestibulum iaculis justo vehicula. Vivamus aliquam ipsum ac varius luctus. Donec tristique mauris at efficitur accumsan. Duis volutpat molestie metus eget malesuada.
                </Text>
                <Text style={[styles.largeText, styles.paragraph]}>Vestibulum ante ipsum</Text>
                <Text style={[styles.text, styles.paragraph]}>
                    Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas vulputate tempor tempus. Nulla ex nisl, feugiat ut tempus non, porta non nibh. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris imperdiet pretium nibh, non pretium velit scelerisque at. Nulla dapibus egestas sem sit amet feugiat. Maecenas accumsan hendrerit ultricies.
                </Text>
            </ScrollView>
        </View>
    );
}