# Greenfield Marketplace

Greenfield Data marketplace is a data exchange platform where users can freely create, list, trade, and sell data assets, including digital publications, scientific experimental data, and specific domain data, or even NFT can be treated as a kind of data.

### Demo link

[BNB Greenfield Data Marketplace](https://gnfd-testnet-sp4.bnbchain.org/view/data-marketplace/index.html)

### Start the project

Clone the project and install dependencies:

```bash
> git clone https://github.com/bnb-chain/greenfield-data-marketplace-frontend.git
> cd greenfield-data-marketplace-frontend
> pnpm install
> cp .env.example .env.development.local
```

modify the value of REACT_APP_DAPP_NAME in the .env.development.local file, you can set it to the value you like:

```
REACT_APP_DAPP_NAME=${DAPP_NAME}
```

abd then run example:

```bash
> pnpm run start
```

if you want to add dependency:

```bash
> pnpm i react
```

### Publish the project

publish to production environment:

```bash
> cp .env.example .env.production
```

you also need to modify the value of REACT_APP_DAPP_NAME and PUBLIC_URL:

```
PUBLIC_URL=${PUBLIC_URL}
REACT_APP_DAPP_NAME=${DAPP_NAME}
```

then build example:

```bash
> pnpm run build
```

If you want to output all the files to index.html so that they can be deployed on decentralized storage platforms, such as [dCellar](https://dcellar.io/):

```bash
> pnpm run build:gf
```

finally, you can see the output resources in the build directory

## Documentation

| Description                                                                                                  |
| ------------------------------------------------------------------------------------------------------------ |
| [greenfield-data-marketplace-contracts](https://github.com/bnb-chain/greenfield-data-marketplace-contracts/) |
| [BNB greenfield official website](https://greenfield.bnbchain.org/en)                                        |
| [Guide to BNB Greenfield](https://docs.bnbchain.org/greenfield-docs/docs/guide/home)                         |
| [Discord of BNB Greenfield](https://discord.gg/bnbchain)                                                     |
| [Forum of bnbchain](https://forum.bnbchain.org/)                                                             |
| [Guide to BNB Greenfield](https://docs.bnbchain.org/greenfield-docs/docs/guide/home)                         |

## Contribution

Look over [CONTRIBUTING](./CONTRIBUTING.md)

## Disclaimer

Look over [DISCLAIMER](./DISCLAIMER.md)

## License

The library is licensed under the
[GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.en.html),
also included in our repository in the [LICENSE](./LICENSE) file.
