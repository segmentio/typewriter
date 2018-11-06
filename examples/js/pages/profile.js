import React from 'react'
import Layout from '../components/Layout'
import Analytics from './generated'

export default class Profile extends React.Component {
  componentDidMount() {
    const appAnalytics = new Analytics(window.analytics)
    appAnalytics.profileViewed({ profile_id: '3' })
  }
  render() {
    return (
      <Layout>
        <div className='main'>
          <h1 className='heading'>
            User profile:
            {' '}
            <b className='username'>{this.props.url.query.id}</b>
          </h1>
          <style jsx>{`
            .main {
              padding: 100px;
            }
            .heading {
              font: 15px Monaco;
            }
            .username {
              color: blue;
            }
          `}</style>
        </div>
      </Layout>
    )
  }
}
