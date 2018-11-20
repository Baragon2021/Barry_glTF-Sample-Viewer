class gltfLoader
{
    static load(gltf, appendix = undefined)
    {
        let buffers;
        let additionalFiles;
        if (appendix && appendix.length > 0)
        {
            if (appendix[0] instanceof ArrayBuffer)
            {
                buffers = appendix;
            }
            else if (appendix[0] instanceof File)
            {
                additionalFiles = appendix;
            }
        }

        let promises = [];

        if (buffers)
        {
            const count = Math.min(buffers.length, gltf.buffers.length);
            for (let i = 0; i < count; ++i)
            {
                gltf.buffers[i].buffer = buffers[i];
            }
        }
        else if (additionalFiles)
        {
            for (const buffer of gltf.buffers)
            {
                promises.push(buffer.loadFromFiles(additionalFiles));
            }
        }
        else
        {
            for (let buffer of gltf.buffers)
            {
                promises.push(buffer.load(gltf.path));
            }
        }

        for (let image of gltf.images)
        {
            promises.push(image.load(gltf, additionalFiles));
        }

        return promises;
    }

    static unload(gltf)
    {
        for (let image of gltf.images)
        {
            image.image = undefined;
        }

        for (let texture of gltf.textures)
        {
            texture.destroy();
        }

        for (let accessor of gltf.accessors)
        {
            accessor.destroy();
        }
    }
};
