import React from 'react'

import Layout from '../../containers/Layout'

import Header from '../../components/Header'
import Body from '../../components/Body'
import Footer from '../../components/Footer'

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
