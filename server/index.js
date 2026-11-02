
// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const crypto = require('crypto');

// const app = express();
// const PORT = Number(process.env.PORT || 3001);
// const UPLOAD_ROOT = path.join(__dirname, 'uploads');

// app.use(cors({
//   origin: process.env.FRONTEND_ORIGIN
//     ? process.env.FRONTEND_ORIGIN.split(',').map(v => v.trim())
//     : true
// }));

// app.use(express.json({ limit: '1mb' }));

// // 确保本地媒体根目录存在
// fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

// function validateNfcId(value) {
//   return typeof value === 'string'
//     && /^[A-Za-z0-9_-]{1,64}$/.test(value);
// }

// function spaceDir(nfcid) {
//   return path.join(UPLOAD_ROOT, nfcid);
// }

// function mediaType(filename) {
//   return /\.mp4$/i.test(filename) ? 'video' : 'image';
// }

// // 只允许访问通过 API 读取的媒体，不直接暴露整个 uploads 目录
// function publicMediaItem(nfcid, filename, stats) {
//   const key = `spaces/${nfcid}/${filename}`;

//   return {
//     key,
//     name: filename,
//     size: stats.size,
//     lastModified: stats.mtime.toISOString(),
//     type: mediaType(filename),
//     url: `/api/spaces/${encodeURIComponent(nfcid)}/media/file/${encodeURIComponent(filename)}`
//   };
// }

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     const nfcid = req.params.nfcid;

//     if (!validateNfcId(nfcid)) {
//       return cb(new Error('NFC ID 格式不正确'));
//     }

//     const dir = spaceDir(nfcid);

//     fs.mkdir(dir, { recursive: true }, err => cb(err, dir));
//   },

//   filename(req, file, cb) {
//     const ext = path.extname(file.originalname).toLowerCase();

//     const allowedExt = {
//       '.jpeg': '.jpg',
//       '.jpg': '.jpg',
//       '.png': '.png',
//       '.webp': '.webp',
//       '.mp4': '.mp4'
//     };

//     if (!allowedExt[ext]) {
//       return cb(new Error('只支持 JPG、PNG、WebP 图片和 MP4 视频'));
//     }

//     cb(null, `${Date.now()}-${crypto.randomUUID()}${allowedExt[ext]}`);
//   }
// });

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 100 * 1024 * 1024,
//     files: 6
//   },
//   fileFilter(req, file, cb) {
//     const allowed = [
//       'image/jpeg',
//       'image/png',
//       'image/webp',
//       'video/mp4'
//     ];

//     if (!allowed.includes(file.mimetype)) {
//       return cb(new Error('只支持 JPG、PNG、WebP 图片和 MP4 视频'));
//     }

//     cb(null, true);
//   }
// });

// // 健康检查
// app.get('/api/health', (req, res) => {
//   res.json({
//     ok: true,
//     service: 'shancheng-memory-api',
//     storage: 'local'
//   });
// });

// // 获取某个 NFC 空间的媒体列表
// app.get('/api/spaces/:nfcid/media', async (req, res, next) => {
//   try {
//     const { nfcid } = req.params;

//     if (!validateNfcId(nfcid)) {
//       return res.status(400).json({ error: 'NFC ID 格式不正确' });
//     }

//     const dir = spaceDir(nfcid);
//     await fs.promises.mkdir(dir, { recursive: true });

//     const names = await fs.promises.readdir(dir);
//     const items = [];

//     for (const name of names) {
//       const fullPath = path.join(dir, name);
//       const stats = await fs.promises.stat(fullPath);

//       if (!stats.isFile()) continue;

//       if (!/\.(jpe?g|png|webp|mp4)$/i.test(name)) continue;

//       items.push(publicMediaItem(nfcid, name, stats));
//     }

//     items.sort((a, b) =>
//       new Date(b.lastModified) - new Date(a.lastModified)
//     );

//     res.json({ nfcid, items });
//   } catch (err) {
//     next(err);
//   }
// });

// // 读取图片或视频
// app.get(
//   '/api/spaces/:nfcid/media/file/:filename',
//   async (req, res, next) => {
//     try {
//       const { nfcid, filename } = req.params;

//       if (
//         !validateNfcId(nfcid) ||
//         !/^[A-Za-z0-9_.-]{1,200}$/.test(filename) ||
//         filename.includes('..')
//       ) {
//         return res.status(400).json({ error: '文件路径无效' });
//       }

//       const filePath = path.join(spaceDir(nfcid), filename);
//       const stats = await fs.promises.stat(filePath);

//       if (!stats.isFile()) {
//         return res.status(404).json({ error: '文件不存在' });
//       }

//       res.sendFile(filePath);
//     } catch (err) {
//       if (err.code === 'ENOENT') {
//         return res.status(404).json({ error: '文件不存在' });
//       }
//       next(err);
//     }
//   }
// );

// // 上传：multipart/form-data，字段名 files，最多 6 个
// app.post(
//   '/api/spaces/:nfcid/media',
//   (req, res, next) => {
//     if (!validateNfcId(req.params.nfcid)) {
//       return res.status(400).json({ error: 'NFC ID 格式不正确' });
//     }
//     next();
//   },
//   upload.array('files', 6),
//   (req, res, next) => {
//     try {
//       const { nfcid } = req.params;
//       const files = req.files || [];

//       if (!files.length) {
//         return res.status(400).json({ error: '请选择要上传的文件' });
//       }

//       const items = files.map(file => ({
//         key: `spaces/${nfcid}/${file.filename}`,
//         name: file.filename,
//         size: file.size,
//         type: file.mimetype.startsWith('video/') ? 'video' : 'image',
//         url: `/api/spaces/${encodeURIComponent(nfcid)}/media/file/${encodeURIComponent(file.filename)}`
//       }));

//       res.status(201).json({
//         message: '上传成功',
//         nfcid,
//         items
//       });
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// // 删除：只能删除当前 NFC 空间内的文件
// app.delete('/api/spaces/:nfcid/media', async (req, res, next) => {
//   try {
//     const { nfcid } = req.params;
//     const { key } = req.body || {};

//     if (!validateNfcId(nfcid)) {
//       return res.status(400).json({ error: 'NFC ID 格式不正确' });
//     }

//     const prefix = `spaces/${nfcid}/`;

//     if (
//       typeof key !== 'string' ||
//       !key.startsWith(prefix) ||
//       key.includes('..') ||
//       key.endsWith('/')
//     ) {
//       return res.status(400).json({
//         error: '文件路径无效或不属于当前空间'
//       });
//     }

//     const filename = key.slice(prefix.length);

//     if (
//       !filename ||
//       filename.includes('/') ||
//       !/^[A-Za-z0-9_.-]{1,200}$/.test(filename)
//     ) {
//       return res.status(400).json({ error: '文件路径无效' });
//     }

//     await fs.promises.unlink(path.join(spaceDir(nfcid), filename));

//     res.json({ message: '删除成功', key });
//   } catch (err) {
//     if (err.code === 'ENOENT') {
//       return res.status(404).json({ error: '文件不存在' });
//     }
//     next(err);
//   }
// });

// // 统一错误处理
// app.use((err, req, res, next) => {
//   console.error('[API Error]', err.message);

//   if (err instanceof multer.MulterError) {
//     const message = err.code === 'LIMIT_FILE_SIZE'
//       ? '单个文件不能超过 100 MB'
//       : err.code === 'LIMIT_FILE_COUNT'
//         ? '一次最多上传 6 个文件'
//         : '文件上传失败';

//     return res.status(400).json({ error: message });
//   }

//   if (err.message === '只支持 JPG、PNG、WebP 图片和 MP4 视频') {
//     return res.status(400).json({ error: err.message });
//   }

//   res.status(500).json({
//     error: '服务器处理失败，请稍后重试'
//   });
// });

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`山城拾光本地 API 已启动：http://localhost:${PORT}`);
//   console.log(`媒体保存目录：${UPLOAD_ROOT}`);
// });




require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const OSS = require('ali-oss');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = Number(process.env.PORT || 3001);
const TEMP_ROOT = path.join(os.tmpdir(), 'shancheng-memory-temp');

fs.mkdirSync(TEMP_ROOT, { recursive: true });

const {
  OSS_REGION,
  OSS_BUCKET,
  OSS_ACCESS_KEY_ID,
  OSS_ACCESS_KEY_SECRET
} = process.env;

if (
  !OSS_REGION ||
  !OSS_BUCKET ||
  !OSS_ACCESS_KEY_ID ||
  !OSS_ACCESS_KEY_SECRET
) {
  throw new Error(
    '缺少 OSS 配置，请检查 server/.env 中的 OSS_REGION、OSS_BUCKET 和 AccessKey'
  );
}

// OSS Bucket 应保持私有。
// AccessKey 只保存在后端环境变量中。
const oss = new OSS({
  region: OSS_REGION,
  bucket: OSS_BUCKET,
  accessKeyId: OSS_ACCESS_KEY_ID,
  accessKeySecret: OSS_ACCESS_KEY_SECRET,
  authorizationV4: true,
  secure: true
});

const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN
    .split(',')
    .map(value => value.trim())
    .filter(Boolean)
  : [];

app.use(cors({
  origin(origin, callback) {
    // 允许没有 Origin 的服务端请求；浏览器跨域请求按白名单判断。
    if (
      !origin ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error('请求来源不在允许列表中'));
  }
}));

app.use(express.json({ limit: '1mb' }));

function validateNfcId(value) {
  return typeof value === 'string' &&
    /^[A-Za-z0-9_-]{1,64}$/.test(value);
}

function mediaPrefix(nfcid) {
  return `spaces/${nfcid}/`;
}

function mediaType(filename) {
  return /\.(mp4|mov)$/i.test(filename) ? 'video' : 'image';
}

function allowedExtension(filename) {
  const ext = path.extname(filename).toLowerCase();

  return ['.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.heic',
    '.heif',
    '.mp4',
    '.mov'].includes(ext);
}

function publicMediaItem(nfcid, object) {
  const filename = object.name.slice(mediaPrefix(nfcid).length);

  return {
    key: object.name,
    name: filename,
    size: Number(object.size || 0),
    lastModified: object.lastModified || null,
    type: mediaType(filename),
    // 仍通过原来的 API 路径读取。
    // 后端会在请求时生成短时效 OSS 签名 URL。
    url:
      `/api/spaces/${encodeURIComponent(nfcid)}` +
      `/media/file/${encodeURIComponent(filename)}`
  };
}

// 上传文件先暂存在服务器临时目录，随后传到 OSS。
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, TEMP_ROOT);
  },

  filename(req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase();

    const extMap = {
      '.jpeg': '.jpg',
      '.jpg': '.jpg',
      '.png': '.png',
      '.webp': '.webp',
      '.mp4': '.mp4',
      '.mov': '.mov',// 新增：支持 iPhone 现场录制的视频
      '.heic': '.heic',
      '.heif': '.heif',

    };

    if (!extMap[ext]) {
      return callback(
        new Error(`不支持的文件格式：${file.mimetype}`)
      );
    }

    callback(
      null,
      `${Date.now()}-${crypto.randomUUID()}${extMap[ext]}`
    );
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 6
  },
  fileFilter(req, file, callback) {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      "image/heic",
      "image/heif",
      "application/octet-stream"
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        // new Error('只支持 JPG、PNG、WebP 图片和 MP4 视频')
        new Error(`不支持的文件格式：${file.mimetype}`),
        false
      );
    }

    callback(null, true);
  }
});

// 清理本次请求生成的本地临时文件。
async function cleanupTempFiles(files) {
  await Promise.all(
    (files || []).map(async file => {
      if (!file.path) return;

      try {
        await fs.promises.unlink(file.path);
      } catch (err) {
        if (err.code !== 'ENOENT') {
          console.error('[临时文件清理失败]', err.message);
        }
      }
    })
  );
}

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'shancheng-memory-api',
    storage: 'aliyun-oss'
  });
});

// 获取某个 NFC 空间的媒体列表。
// 支持分页读取，避免一次请求读取过多对象。
app.get('/api/spaces/:nfcid/media', async (req, res, next) => {
  try {
    const { nfcid } = req.params;

    if (!validateNfcId(nfcid)) {
      return res.status(400).json({
        error: 'NFC ID 格式不正确'
      });
    }

    const prefix = mediaPrefix(nfcid);
    const items = [];
    let continuationToken;

    do {
      const options = {
        prefix,
        'max-keys': 1000
      };

      if (continuationToken) {
        options['continuation-token'] = continuationToken;
      }

      const result = await oss.listV2(options);

      for (const object of result.objects || []) {
        if (!object.name.startsWith(prefix)) continue;

        const filename = object.name.slice(prefix.length);

        // 只展示当前空间下的文件，不展示子目录。
        if (!filename || filename.includes('/')) continue;
        if (!allowedExtension(filename)) continue;

        items.push(publicMediaItem(nfcid, object));
      }

      continuationToken = result.nextContinuationToken;
    } while (continuationToken);

    items.sort((a, b) =>
      new Date(b.lastModified || 0) -
      new Date(a.lastModified || 0)
    );

    res.json({ nfcid, items });
  } catch (err) {
    next(err);
  }
});

// 读取图片或视频。
// 对私有 OSS 对象生成短期 GET 签名 URL，再重定向给浏览器。
// 签名 URL 是临时访问凭证，不应公开分享。
app.get(
  '/api/spaces/:nfcid/media/file/:filename',
  async (req, res, next) => {
    try {
      const { nfcid, filename } = req.params;

      if (
        !validateNfcId(nfcid) ||
        !/^[A-Za-z0-9_.-]{1,200}$/.test(filename) ||
        filename.includes('..') ||
        !allowedExtension(filename)
      ) {
        return res.status(400).json({
          error: '文件路径无效'
        });
      }

      const key = `${mediaPrefix(nfcid)}${filename}`;

      // 确认对象存在，避免为不存在的文件生成有效链接。
      await oss.head(key);

      // 有效期 10 分钟；有效期内链接可能被重复使用。
      const signedUrl = await oss.signatureUrlV4(
        'GET',
        600,
        {},
        key
      );

      res.setHeader('Cache-Control', 'private, no-store');
      res.redirect(302, signedUrl);
    } catch (err) {
      if (
        err.code === 'NoSuchKey' ||
        err.code === 'NotFound' ||
        err.status === 404
      ) {
        return res.status(404).json({
          error: '文件不存在'
        });
      }

      next(err);
    }
  }
);

// 上传：multipart/form-data，字段名 files，最多 6 个。
app.post(
  '/api/spaces/:nfcid/media',
  (req, res, next) => {
    if (!validateNfcId(req.params.nfcid)) {
      return res.status(400).json({
        error: 'NFC ID 格式不正确'
      });
    }

    next();
  },
  upload.array('files', 6),
  async (req, res, next) => {
    const files = req.files || [];

    try {
      const { nfcid } = req.params;

      if (!files.length) {
        return res.status(400).json({
          error: '请选择要上传的文件'
        });
      }

      const items = [];

      for (const file of files) {
        const key = `${mediaPrefix(nfcid)}${file.filename}`;

        await oss.put(key, file.path, {
          headers: {
            'Content-Type': file.mimetype,
            'Cache-Control': 'private, no-store'
          }
        });

        items.push({
          key,
          name: file.filename,
          size: file.size,
          type: mediaType(file.filename),
          url:
            `/api/spaces/${encodeURIComponent(nfcid)}` +
            `/media/file/${encodeURIComponent(file.filename)}`
        });
      }

      res.status(201).json({
        message: '上传成功',
        nfcid,
        items
      });
    } catch (err) {
      next(err);
    } finally {
      await cleanupTempFiles(files);
    }
  }
);

// 删除：只能删除当前 NFC 空间前缀下的文件。
app.delete(
  '/api/spaces/:nfcid/media',
  async (req, res, next) => {
    try {
      const { nfcid } = req.params;
      const { key } = req.body || {};

      if (!validateNfcId(nfcid)) {
        return res.status(400).json({
          error: 'NFC ID 格式不正确'
        });
      }

      const prefix = mediaPrefix(nfcid);

      if (
        typeof key !== 'string' ||
        !key.startsWith(prefix) ||
        key.includes('..') ||
        key.endsWith('/')
      ) {
        return res.status(400).json({
          error: '文件路径无效或不属于当前空间'
        });
      }

      const filename = key.slice(prefix.length);

      if (
        !filename ||
        filename.includes('/') ||
        !/^[A-Za-z0-9_.-]{1,200}$/.test(filename) ||
        !allowedExtension(filename)
      ) {
        return res.status(400).json({
          error: '文件路径无效'
        });
      }

      await oss.delete(key);

      res.json({
        message: '删除成功',
        key
      });
    } catch (err) {
      next(err);
    }
  }
);

// 统一错误处理
app.use((err, req, res, next) => {
  console.error('[API Error]', err.code || '', err.message);

  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? '单个文件不能超过 100 MB'
      : err.code === 'LIMIT_FILE_COUNT'
        ? '一次最多上传 6 个文件'
        : '文件上传失败';

    return res.status(400).json({ error: message });
  }

  if (
    err.message ===
    '只支持 JPG、PNG、WebP 图片和 MP4 视频'
  ) {
    return res.status(400).json({
      error: err.message
    });
  }

  if (err.message === '请求来源不在允许列表中') {
    return res.status(403).json({
      error: '请求来源不允许'
    });
  }

  console.error('[API Error]', err);
  res.status(500).json({
    error: '服务器处理失败，请稍后重试'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`山城拾光 API 已启动，端口：${PORT}`);
  console.log(`媒体存储：阿里云 OSS / ${OSS_BUCKET}`);
});
