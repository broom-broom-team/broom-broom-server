const model = require("../models");
const wkt = require("terraformer-wkt-parser");

exports.get_address = async (req, res, next) => {
  try {
    const userAddress = await model.UserAddress.findOne({ where: { userId: req.user.id } });
    const addressScope = userAddress.addressScope;
    const district = await model.District.findOne({ where: { id: userAddress.districtId } });
    const simpleAddress = district.simpleAddress;
    return res.status(200).json({ success: true, message: "회원의 기준지역과 활동범위를 반환합니다.", simpleAddress, addressScope });
  } catch (e) {
    return next(e);
  }
};

exports.post_check = async (req, res, next) => {
  const pool = require("../helpers/pool");
  const { addressScope } = req.body;
  try {
    const userAddress = await model.UserAddress.findOne({ where: { userId: req.user.id } });
    const district = await model.District.findOne({ where: { id: userAddress.districtId } });
    const conn = await pool.getConn();
    const [districts] = await conn.query(
      `SELECT * FROM districts WHERE ST_Intersects(geopolygon, ST_GeomFromText(ST_AsText(ST_Buffer(ST_GeomFromText(ST_AsText(ST_GeomFromText('${wkt.convert(
        district.geopoint
      )}', 4326))), ${addressScope * 0.01})), 4326));`
    );
    conn.release();
    const neighboehoods = new Array();
    for (let i = 0; i < districts.length; i++) {
      neighboehoods.push(districts[i].simpleAddress);
    }
    return res.status(200).json({ success: true, message: "활동범위내 근처동네들을 불러옵니다.", count: neighboehoods.length, neighboehoods });
  } catch (e) {
    return next(e);
  }
};
