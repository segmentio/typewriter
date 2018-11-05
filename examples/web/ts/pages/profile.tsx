import React from 'react'
import Layout from '../components/Layout'
import analytics from '../analytics'

export default class Profile extends React.Component<any> {
  public componentDidMount() {
    analytics.profileViewed({ profileID: '3' })
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
