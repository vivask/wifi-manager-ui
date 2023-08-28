# Vue user interface for wifi manager

This is the user interface for wifi manager, more can be seen here https://github.com/vivask/wifi-manager

## Install the dependencies

```sh
~cd /tmp
~git clone https://github.com/vivask/wifi-manager-ui.git
~cd wifi-manager-ui
~npm install
~npm run dev    - for development
~npm run build  - for build
```

The finished build must be copied to the wifi manager _dist_ folder:

```sh
~rm -rf wifi-manager/components/wifi-manager/dist
~cp wifi-manager-ui/components/wifi-manager/dist wifi-manager/components/wifi-manager/dist
```
