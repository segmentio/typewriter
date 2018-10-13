import React from 'react'
import Frame from '../components/Frame'
import Layout from '../components/Layout'
import * as analytics from './generated'

export default class Photo extends React.Component {
  componentDidMount() {
    analytics.photoViewed({ photoID: '3' })
  }
  render() {
    return (
      <Layout>
      <div className='permalink'>
        <div className='wrap'>
          <Frame id={this.props.url.query.id} />
        </div>
        <style jsx>{`
          .permalink {
            padding: 100px;
            text-align: center;
          }
          .wrap {
            display: inline-block;
            border: 1px solid #999;
            margin: auto;
          }
        `}</style>
      </div>
    </Layout>
    )
  }
}