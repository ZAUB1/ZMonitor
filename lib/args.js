class ArgsLaunch {
    constructor()
    {
        this.needverbose = false;

        process.argv.forEach((val, index, array) => {
            switch (val)
            {
                case "-v":
                    this.needverbose = true;
                    break;

                default:
                    //
            }
        });
    }
}

module.exports = new ArgsLaunch;