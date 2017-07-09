import React from 'react'

import Layout from '../../containers/Layout.jsx'

import Header from '../../components/Header.jsx'
import Body from '../../components/Body.jsx'
import Footer from '../../components/Footer.jsx'

export default (props) => {
  return (
    <Layout>
      <Header color='#134ac0' />

      <Body>
        {props.link}
      </Body>

      <Footer color='#134ac0' />
    </Layout>
  )
}
