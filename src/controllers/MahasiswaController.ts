import IRS from "../db/models/IRS";
import Mahasiswa from "../db/models/Mahasiswa";
import Helper from "../helpers/Helper";
import { Request, Response } from "express";
import uploadImage from "../middleware/UploudImage";
import { Op } from "sequelize";
import sequelize, { Sequelize } from "sequelize/types/sequelize";
import KHS from "../db/models/KHS";
import PKL from "../db/models/PKL";
import Skripsi from "../db/models/Skripsi";

const GetMahasiswaByNIM = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;

  try {
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { NIM: NIM },
    });

    if (!dataMahasiswa) {
      return res
        .status(403)
        .send(Helper.ResponseData(403, "Unauthorized", null, null));
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data mahasiswa dengan NIM " + NIM,
          null,
          dataMahasiswa
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data mahasiswa dengan NIM " + NIM,
          err,
          null
        )
      );
  }
};

const UpdataDataPhoto = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIM } = req.params;

  try {
    await uploadImage(req, res);
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { NIM: NIM },
    });

    if (!dataMahasiswa) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "Unauthorized", null, null));
    }

    if (req.file == undefined) {
      return res
        .status(400)
        .send({ message: "Please upload an image for photo profile!" });
    }

    const data = {
      photo: "http://localhost:5502/images/" + req.file.filename,
    };

    await Mahasiswa.update(data, {
      where: { NIM: NIM },
    });

    return res
      .status(200)
      .send(Helper.ResponseData(200, "Photo Berhasil Di Uploud", null, data));
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mengubah photo mahasiswa dengan NIM " + NIM,
          err,
          null
        )
      );
  }
};

const UpdateData = async (req: Request, res: Response): Promise<Response> => {
  const { NIM } = req.params;
  const { nama, alamat, kabkota, provinsi, jalurMasuk, noHP, email, status } =
    req.body;

  try {
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { NIM: NIM },
    });

    if (!dataMahasiswa) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "Unauthorized", null, null));
    }
    console.log(dataMahasiswa);
    const data = {
      NIM: NIM,
      angkatan: dataMahasiswa?.angkatan,
      nama: nama,
      alamat: alamat,
      kabkota: kabkota,
      provinsi: provinsi,
      jalurMasuk: jalurMasuk,
      noHP: noHP,
      email: email,
      status: status,
      photo: dataMahasiswa?.photo,
      userId: dataMahasiswa?.userId,
      dosenWaliNIP: dataMahasiswa?.dosenWaliNIP,
    };

    await Mahasiswa.update(data, {
      where: { NIM: NIM },
    });

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mengubah data mahasiswa dengan NIM " + NIM,
          null,
          data
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mengubah data mahasiswa dengan NIM " + NIM,
          err,
          null
        )
      );
  }
};

const GetMahasiswaByUserId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userid } = req.params;

  try {
    const dataMahasiswa = await Mahasiswa.findOne({
      where: { userId: userid },
    });

    const data = {
      NIM: dataMahasiswa?.NIM,
      nama: dataMahasiswa?.nama,
      alamat: dataMahasiswa?.alamat,
      kabkota: dataMahasiswa?.kabkota,
      provinsi: dataMahasiswa?.provinsi,
      angkatan: dataMahasiswa?.angkatan,
      jalurMasuk: dataMahasiswa?.jalurMasuk,
      email: dataMahasiswa?.email,
      noHP: dataMahasiswa?.noHP,
      status: dataMahasiswa?.status,
      photo: dataMahasiswa?.photo,
      userId: dataMahasiswa?.userId,
      dosenWaliNIP: dataMahasiswa?.dosenWaliNIP,
    };

    if (!dataMahasiswa) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Unauthorized For Get Data Mahasiwa",
            null,
            null
          )
        );
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data mahasiswa dengan NIM " + userid,
          null,
          data
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data mahasiswa dengan NIM " + userid,
          err,
          null
        )
      );
  }
};

const GetMahasiswaByKeywordAndDoswalNIP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { keyword, doswalNIP } = req.params;

  try {
    const dataMahasiswa = await Mahasiswa.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                NIM: {
                  [Op.like]: "%" + keyword + "%",
                },
              },
              {
                nama: {
                  [Op.like]: "%" + keyword + "%",
                },
              },
            ],
          },
          {
            dosenWaliNIP: doswalNIP,
          },
        ],
      },
    });

    if (!dataMahasiswa) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Unauthorized For Get Data Mahasiwa",
            null,
            null
          )
        );
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data mahasiswa dengan NIP " + doswalNIP,
          null,
          dataMahasiswa
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data mahasiswa dengan NIP " + doswalNIP,
          err,
          null
        )
      );
  }
};

const GetMahasiswaWithNotVerifiedIRSByBIP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP } = req.params;

  try {
    const dataIRS = await IRS.findAll({
      where: {
        verified: false,
      },
    });

    // ambil data mahasiswa berdasarkan NIM hasil dataIRS
    const dataMahasiswaDikirim: any = [];
    const dataMahasiswa = new Set();
    dataIRS.forEach(async (element) => {
      dataMahasiswa.add(element.NIM);
    });

    const dataMahasiswaValues = dataMahasiswa.values();
    for (const data of dataMahasiswaValues) {
      const dataMahasiswaBuf = await Mahasiswa.findOne({
        where: {
          [Op.and]: [
            {
              NIM: data || "",
            },
            {
              dosenWaliNIP: NIP,
            },
          ],
        },
      });

      if (dataMahasiswaBuf) {
        dataMahasiswaDikirim.push(dataMahasiswaBuf);
        console.log(dataMahasiswaBuf);
      }
    }
    if (!dataMahasiswa) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Unauthorized For Get Data Mahasiwa",
            null,
            null
          )
        );
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data mahasiswa dengan NIP " + NIP,
          null,
          dataMahasiswaDikirim
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data mahasiswa dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

const GetMahasiswaWithNotVerifiedKHSByBIP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP } = req.params;

  try {
    const dataIRS = await KHS.findAll({
      where: {
        verified: false,
      },
    });

    // ambil data mahasiswa berdasarkan NIM hasil dataIRS
    const dataMahasiswaDikirim: any = [];
    const dataMahasiswa = new Set();
    dataIRS.forEach(async (element) => {
      dataMahasiswa.add(element.NIM);
    });

    const dataMahasiswaValues = dataMahasiswa.values();
    for (const data of dataMahasiswaValues) {
      const dataMahasiswaBuf = await Mahasiswa.findOne({
        where: {
          [Op.and]: [
            {
              NIM: data || "",
            },
            {
              dosenWaliNIP: NIP,
            },
          ],
        },
      });

      if (dataMahasiswaBuf) {
        dataMahasiswaDikirim.push(dataMahasiswaBuf);
        console.log(dataMahasiswaBuf);
      }
    }
    if (!dataMahasiswa) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Unauthorized For Get Data Mahasiwa",
            null,
            null
          )
        );
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data mahasiswa dengan NIP " + NIP,
          null,
          dataMahasiswaDikirim
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data mahasiswa dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

const GetMahasiswaWithNotVerifiedPKLByBIP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP } = req.params;

  try {
    const dataIRS = await PKL.findAll({
      where: {
        verified: false,
      },
    });

    // ambil data mahasiswa berdasarkan NIM hasil dataIRS
    const dataMahasiswaDikirim: any = [];
    const dataMahasiswa = new Set();
    dataIRS.forEach(async (element) => {
      dataMahasiswa.add(element.NIM);
    });

    const dataMahasiswaValues = dataMahasiswa.values();
    for (const data of dataMahasiswaValues) {
      const dataMahasiswaBuf = await Mahasiswa.findOne({
        where: {
          [Op.and]: [
            {
              NIM: data || "",
            },
            {
              dosenWaliNIP: NIP,
            },
          ],
        },
      });

      if (dataMahasiswaBuf) {
        dataMahasiswaDikirim.push(dataMahasiswaBuf);
        console.log(dataMahasiswaBuf);
      }
    }
    if (!dataMahasiswa) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Unauthorized For Get Data Mahasiwa",
            null,
            null
          )
        );
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data mahasiswa dengan NIP " + NIP,
          null,
          dataMahasiswaDikirim
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data mahasiswa dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

const GetMahasiswaWithNotVerifiedSkripsiByBIP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { NIP } = req.params;

  try {
    const dataIRS = await Skripsi.findAll({
      where: {
        verified: false,
      },
    });

    // ambil data mahasiswa berdasarkan NIM hasil dataIRS
    const dataMahasiswaDikirim: any = [];
    const dataMahasiswa = new Set();
    dataIRS.forEach(async (element) => {
      dataMahasiswa.add(element.NIM);
    });

    const dataMahasiswaValues = dataMahasiswa.values();
    for (const data of dataMahasiswaValues) {
      const dataMahasiswaBuf = await Mahasiswa.findOne({
        where: {
          [Op.and]: [
            {
              NIM: data || "",
            },
            {
              dosenWaliNIP: NIP,
            },
          ],
        },
      });

      if (dataMahasiswaBuf) {
        dataMahasiswaDikirim.push(dataMahasiswaBuf);
        console.log(dataMahasiswaBuf);
      }
    }
    if (!dataMahasiswa) {
      return res
        .status(403)
        .send(
          Helper.ResponseData(
            403,
            "Unauthorized For Get Data Mahasiwa",
            null,
            null
          )
        );
    }

    return res
      .status(200)
      .send(
        Helper.ResponseData(
          200,
          "Berhasil mendapatkan data mahasiswa dengan NIP " + NIP,
          null,
          dataMahasiswaDikirim
        )
      );
  } catch (err: any) {
    return res
      .status(500)
      .send(
        Helper.ResponseData(
          500,
          "Gagal mendapatkan data mahasiswa dengan NIP " + NIP,
          err,
          null
        )
      );
  }
};

export default {
  UpdateData,
  GetMahasiswaByNIM,
  UpdataDataPhoto,
  GetMahasiswaByUserId,
  GetMahasiswaByKeywordAndDoswalNIP,
  GetMahasiswaWithNotVerifiedIRSByBIP,
  GetMahasiswaWithNotVerifiedKHSByBIP,
  GetMahasiswaWithNotVerifiedPKLByBIP,
  GetMahasiswaWithNotVerifiedSkripsiByBIP,
};
