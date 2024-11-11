import React from 'react'
import styles from './Logo.module.css'
import { Link } from 'react-router-dom';
import logo from '../public/logo.png'

export default function Logo() {
  return (
    <Link to="/">
      <img src={logo} alt="WorldWise logo" className={styles.logo} />
    </Link>
  );
}
