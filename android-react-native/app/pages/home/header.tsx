import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../../styles/styles';
import Menu from './menu';

export default function Header() {
    const navigator = useNavigation();

    const [menu, setMenu] = useState(false);

    return (
        <View style={[styles.foreground, pageStyles.header, {flexDirection: 'row'}]}>
            <TouchableOpacity style={{height: '100%', width: '25%', left: '-2%'}} onPress={() => setMenu(!menu)}>
                <Image style={{height: '60%', width: '100%', top: '20%', resizeMode: 'contain'}} source={require('@/assets/images/menu-icon.png')}></Image>
            </TouchableOpacity>
            {menu ? <Menu closer={setMenu} a={menu} /> : <></>}
            <Text style={[styles.largeText, styles.bold, {marginTop: '3.5%', marginLeft: '-1%', fontSize: 24, fontWeight: 600}]}>Home</Text>
        </View>
    );
}

const pageStyles = StyleSheet.create({
    header: {
        height: '8%',
        width: '100%'
    }
});
