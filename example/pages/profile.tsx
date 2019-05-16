import React from 'react'
import Layout from '../components/Layout'
import Analytics from '../analytics'

export default class Profile extends React.Component<any> {
  public componentDidMount() {
    const analytics = new Analytics(window.analytics)
    analytics.profileViewed({ profile_id: this.props.url.query.id })
  }

  public render() {
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
