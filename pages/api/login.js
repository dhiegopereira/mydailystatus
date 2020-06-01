import auth0 from '../../lib/auth0'

const login = async(req, res) => {
    console.log('Login Loading')
    await auth0.handleLogin(req, res, () => {
        console.log('Loaded')
    })    
}

export default login
