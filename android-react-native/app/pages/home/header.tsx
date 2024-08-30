import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../../styles/styles';
import Menu from './menu';

export default function Header() {
    const navigator = useNavigation();

    const [menu, setMenu] = useState(false);

    return (
        <View style={[styles.foreground, pageStyles.header]}>
            <TouchableOpacity style={styles.button} onPress={() => setMenu(!menu)}>
                <Text style={styles.text}>Menu</Text>
            </TouchableOpacity>
            {menu ? <Menu closer={setMenu} a={menu} /> : <></>}
        </View>
    );
}

const pageStyles = StyleSheet.create({
    header: {
        height: '10%',
        width: '100%'
    }
});
