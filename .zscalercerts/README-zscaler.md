The file [.zscalercerts/zscalerrootcert.pem](zscalerrootcert.pem) in this project contains the contents of the
`zscalerrootcert.pem` file downloaded from
[here](https://mutualofomaha.sharepoint.com/sites/ISInfoSec/DIAZscaler/Forms/AllItems.aspx?csf=1&web=1&e=A7sG1v&OR=Teams%2DHL&CT=1625682245860&cid=f92fd805%2D56f6%2D4732%2Da592%2De726dc91bd41&RootFolder=%2Fsites%2FISInfoSec%2FDIAZscaler%2FZscaler%20Cert&FolderCTID=0x0120004A62D8C6A2496F43800B5FE89C040509)
and also includes public root cas.

Npm & yarn require both the zscaler certificate and a public root certificate in a single file.
The following command was used to append the public root certs the zscaler cert in the link above
`curl https://curl.se/ca/cacert.pem  >> .zscalercert/zscalerrootcert.pem`

This certificate is primarily used for local testing where developers need to download packages from npm, or run
aws cli & cdk commands from a workstation from within the Mutual of Omaha VPN and the certificate is required to 
make SSL connections.
