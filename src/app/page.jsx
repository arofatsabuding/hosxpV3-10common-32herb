"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import { th } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "@fontsource/sarabun";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Dialog, Grid, TextField, Button, Divider, Typography, Card, CardContent, IconButton } from "@mui/material";

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Swal from "sweetalert2";

registerLocale("th", th);


// ✅ เพิ่ม Component Loading
const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 text-lg font-semibold">กำลังโหลดข้อมูล...</p>
      </div>
    </div>
  );
};

export default function Thaipadi() {

  const [hosXPService, setHosXPService] = useState([]);
  const [hosXPDrug, setHosXPDrug] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState(""); // ✅ เก็บข้อความแจ้งเตือน
  const [open, setOpen] = useState(false);

  //service
  const [mainDep, setMainDep] = useState("");
  const [oic_n, setOic_n] = useState("");
  const [oic_c, setOic_c] = useState("");
  const [oic_o, setOic_o] = useState("");
  const [oic_l, setOic_l] = useState("");
  const [otc_o, setOtc_o] = useState("");
  const [otc_l, setOtc_l] = useState("");
  const [pcodeA2, setPcodeA2] = useState("");
  const [pcodeUC, setPcodeUC] = useState("");
  const [pcodeA7, setPcodeA7] = useState("");
  //service

  //drug01
  const [icd10List01, setIcd10List01] = useState("");
  const [providerCodes01, setProviderCodes01] = useState("");
  const [providerCodes081, setProviderCodes081] = useState("");
  const [plaiCodes, setPlaiCodes] = useState("");
  const [praCodes, setPraCodes] = useState("");
  const [priangCodes, setPriangCodes] = useState("");
  const [taraCodes, setTaraCodes] = useState("");
  const [prikCodes, setPrikCodes] = useState("");
  //drug01

  //drug02
  const [icd10List02, setIcd10List02] = useState([]);
  const [fahCodes, setFahCodes] = useState([]);
  const [maweangCodes, setMaweangCodes] = useState([]);
  const [pomCodes, setPomCodes] = useState([]);
  const [treeplaCodes, setTreeplaCodes] = useState([]);
  const [prapCodes, setPrapCodes] = useState([]);
  //drug02

  const [icd10List03, setIcd10List03] = useState("");
  const [cuminCodes, setCuminCodes] = useState("");
  const [tardCodes, setTardCodes] = useState("");
  const [khingCodes, setKhingCodes] = useState("");
  const [icd10List041, setIcd10List041] = useState("");
  const [petCodes, setPetCodes] = useState("");
  const [icd10List042, setIcd10List042] = useState("");
  const [kotCodes, setKotCodes] = useState("");
  const [icd10List05, setIcd10List05] = useState("");
  const [nawakotCodes, setNawakotCodes] = useState("");
  const [intjakCodes, setIntjakCodes] = useState("");
  const [icd10List06, setIcd10List06] = useState("");
  const [lomCodes, setLomCodes] = useState("");
  const [tamlaiCodes, setTamlaiCodes] = useState("");
  const [icd10List071, setIcd10List071] = useState("");
  const [payayoCodes, setPayayoCodes] = useState("");
  const [icd10List072, setIcd10List072] = useState("");
  const [aloCodes, setAloCodes] = useState("");
  const [icd10List073, setIcd10List073] = useState("");
  const [mangosteenCodes, setMangosteenCodes] = useState("");
  const [icd10List074, setIcd10List074] = useState("");
  const [thongCodes, setThongCodes] = useState("");
  const [icd10List08, setIcd10List08] = useState("");
  const [suksaiCodes, setSuksaiCodes] = useState("");
  const [jitCodes, setJitCodes] = useState("");
  const [thcCodes, setThcCodes] = useState("");
  const [icd10List09, setIcd10List09] = useState("");
  const [bananaCodes, setBananaCodes] = useState("");
  const [yellowCodes, setYellowCodes] = useState("");
  const [icd10List10, setIcd10List10] = useState("");
  const [maraCodes, setMaraCodes] = useState("");

  // ตรวจสอบเมื่อเปลี่ยนค่าของวันที่
  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setError("วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด");
    } else {
      setError("");
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && date < startDate) {
      setError("วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น");
    } else {
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      setError("กรุณาเลือกวันที่ให้ครบ");
      return;
    }
    if (startDate > endDate) {
      setError("วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด");
      return;
    }
    fetchHosXPData()
  };

  const fetchHosXPData = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // ⏳ Timeout 10 วินาที

    Swal.fire({
      title: "กำลังโหลดข้อมูล...",
      text: "โปรดรอสักครู่",
      icon: "info",
      allowOutsideClick: false,
      showConfirmButton: false, // ไม่แสดงปุ่ม OK
      didOpen: () => {
        Swal.showLoading(); // แสดงไอคอนโหลด
      }
    });

    const date = { startDate, endDate };

    const serviceData = {
      startDate,
      endDate,
      main_dep: mainDep,
      health_med_operation_item_code_n: oic_n,
      health_med_operation_item_code_c: oic_c,
      health_med_operation_item_code_o: oic_o,
      health_med_operation_item_code_l: oic_l,
      health_med_operation_type_id_o: otc_o,
      health_med_operation_type_id_l: otc_l,
      pcodeA2: pcodeA2,
      pcodeUC: pcodeUC,
      pcodeA7: pcodeA7
    }

    const drug01 = {
      startDate,
      endDate,
      providerCodes01,
      providerCodes081,
      icd10List01,
      plaiCodes,
      praCodes,
      priangCodes,
      taraCodes,
      prikCodes
    }

    const drug02 = {
      startDate,
      endDate,
      providerCodes01,
      providerCodes081,
      icd10List02,
      fahCodes,
      maweangCodes,
      pomCodes,
      treeplaCodes,
      prapCodes
    }

    const drug03 = {
      startDate,
      endDate,
      providerCodes01,
      providerCodes081,
      icd10List03,
      cuminCodes,
      tardCodes,
      khingCodes
    }

    const drug041 = {
      startDate,
      endDate,
      providerCodes01,
      providerCodes081,
      icd10List041,
      petCodes
    }

    const drug042 = {
      startDate,
      endDate,
      providerCodes01,
      providerCodes081,
      icd10List042,
      kotCodes
    }

    const drug05 = {
      startDate,
      endDate,
      providerCodes01,
      providerCodes081,
      icd10List05,
      nawakotCodes,
      intjakCodes,
      khingCodes
    }

    const drug06 = {
      startDate,
      endDate,
      providerCodes01,
      providerCodes081,
      icd10List06,
      lomCodes,
      tamlaiCodes
    }

    const drug071 = {
      startDate,
      endDate,
      providerCodes01,
      providerCodes081,
      icd10List071,
      payayoCodes
    }

    const drug072 = {
      startDate,
      endDate,
      providerCodes01,
      providerCodes081,
      icd10List072,
      aloCodes
    }

    const drug073 = {
      startDate,
      endDate,
      providerCodes01,
      providerCodes081,
      icd10List073,
      mangosteenCodes
    }

    const drug074 = {
      startDate,
      endDate,
      providerCodes01,
      providerCodes081,
      icd10List074,
      thongCodes
    }

    const drug08 = {
      startDate,
      endDate,
      providerCodes01,
      providerCodes081,
      icd10List08,
      suksaiCodes,
      jitCodes,
      thcCodes
    }

    const drug09 = {
      startDate,
      endDate,
      providerCodes01,
      providerCodes081,
      icd10List09,
      fahCodes,
      bananaCodes,
      yellowCodes
    }

    const drug10 = {
      startDate,
      endDate,
      providerCodes01,
      providerCodes081,
      icd10List10,
      maraCodes,
      thcCodes
    }

    try {
      const [ServiceData, Drug01, Drug02, Drug03, Drug041, Drug042, Drug05, Drug06, Drug071, Drug072, Drug073, Drug074, Drug08, Drug09, Drug10] = await Promise.all([
        axios.post(`/api/kpi-service`, serviceData, { headers: { "Content-Type": "application/json" }, signal: controller.signal }),
        axios.post(`/api/kpi-drug01`, drug01, { headers: { "Content-Type": "application/json" }, signal: controller.signal }),
        axios.post(`/api/kpi-drug02`, drug02, { headers: { "Content-Type": "application/json" }, signal: controller.signal }),
        axios.post(`/api/kpi-drug03`, drug03, { headers: { "Content-Type": "application/json" }, signal: controller.signal }),
        axios.post(`/api/kpi-drug041`, drug041, { headers: { "Content-Type": "application/json" }, signal: controller.signal }),
        axios.post(`/api/kpi-drug042`, drug042, { headers: { "Content-Type": "application/json" }, signal: controller.signal }),
        axios.post(`/api/kpi-drug05`, drug05, { headers: { "Content-Type": "application/json" }, signal: controller.signal }),
        axios.post(`/api/kpi-drug06`, drug06, { headers: { "Content-Type": "application/json" }, signal: controller.signal }),
        axios.post(`/api/kpi-drug071`, drug071, { headers: { "Content-Type": "application/json" }, signal: controller.signal }),
        axios.post(`/api/kpi-drug072`, drug072, { headers: { "Content-Type": "application/json" }, signal: controller.signal }),
        axios.post(`/api/kpi-drug073`, drug073, { headers: { "Content-Type": "application/json" }, signal: controller.signal }),
        axios.post(`/api/kpi-drug074`, drug074, { headers: { "Content-Type": "application/json" }, signal: controller.signal }),
        axios.post(`/api/kpi-drug08`, drug08, { headers: { "Content-Type": "application/json" }, signal: controller.signal }),
        axios.post(`/api/kpi-drug09`, drug09, { headers: { "Content-Type": "application/json" }, signal: controller.signal }),
        axios.post(`/api/kpi-drug10`, drug10, { headers: { "Content-Type": "application/json" }, signal: controller.signal })
      ]);
      clearTimeout(timeout)
      setHosXPService(ServiceData.data); // แสดงข้อมูลที่กรองและปรับปรุงแล้ว
      const combinedDrugs = { ...Drug01.data, ...Drug02.data, ...Drug03.data, ...Drug041.data, ...Drug042.data, ...Drug05.data, ...Drug06.data, ...Drug071.data, ...Drug072.data, ...Drug073.data, ...Drug074.data, ...Drug08.data, ...Drug09.data, ...Drug10.data };
      setHosXPDrug(combinedDrugs)
      Swal.close();
    } catch (error) {
      console.error("Error fetching data:", error);
      clearTimeout(timeout);
      Swal.close();
      if (axios.isCancel(error)) {
        Swal.fire({
          title: "โหลดข้อมูลไม่สำเร็จ!",
          text: "ใช้เวลาโหลดข้อมูลนานเกินไป กรุณาตรวจสอบการเชื่อมต่อและลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonText: "ตกลง"
        });
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถโหลดข้อมูลได้",
          icon: "error",
          confirmButtonText: "ตกลง"
        });
      }
    }
  };

  const fetchSettingData = async () => {
    setIsLoading(true)
    try {
      const [data] = await Promise.all([
        axios.get(`/api/data`)
      ]);
      setMainDep(data.data.mainDep)
      setOic_n(data.data.oic_n)
      setOic_c(data.data.oic_c)
      setOic_o(data.data.oic_o)
      setOic_l(data.data.oic_l)
      setOtc_o(data.data.otc_o)
      setOtc_l(data.data.otc_l)
      setPcodeA2(data.data.pcodeA2)
      setPcodeUC(data.data.pcodeUC)
      setPcodeA7(data.data.pcodeA7)
      setIcd10List01(data.data.icd10List01)
      setProviderCodes01(data.data.providerCodes01)
      setProviderCodes081(data.data.providerCodes081)
      setPlaiCodes(data.data.plaiCodes)
      setPraCodes(data.data.praCodes)
      setPriangCodes(data.data.priangCodes)
      setTaraCodes(data.data.taraCodes)
      setPrikCodes(data.data.prikCodes)
      setIcd10List02(data.data.icd10List02)
      setFahCodes(data.data.fahCodes)
      setMaweangCodes(data.data.maweangCodes)
      setPomCodes(data.data.pomCodes)
      setTreeplaCodes(data.data.treeplaCodes)
      setPrapCodes(data.data.prapCodes)
      setIcd10List03(data.data.icd10List03)
      setCuminCodes(data.data.cuminCodes)
      setTardCodes(data.data.tardCodes)
      setKhingCodes(data.data.khingCodes)
      setIcd10List041(data.data.icd10List041)
      setPetCodes(data.data.petCodes)
      setIcd10List042(data.data.icd10List042)
      setKotCodes(data.data.kotCodes)
      setIcd10List05(data.data.icd10List05)
      setNawakotCodes(data.data.nawakotCodes)
      setIntjakCodes(data.data.intjakCodes)
      setIcd10List06(data.data.icd10List06)
      setLomCodes(data.data.lomCodes)
      setTamlaiCodes(data.data.tamlaiCodes)
      setIcd10List071(data.data.icd10List071)
      setPayayoCodes(data.data.payayoCodes)
      setIcd10List072(data.data.icd10List072)
      setAloCodes(data.data.aloCodes)
      setIcd10List073(data.data.icd10List073)
      setMangosteenCodes(data.data.mangosteenCodes)
      setIcd10List074(data.data.icd10List074)
      setThongCodes(data.data.thongCodes)
      setIcd10List08(data.data.icd10List08)
      setSuksaiCodes(data.data.suksaiCodes)
      setJitCodes(data.data.jitCodes)
      setThcCodes(data.data.thcCodes)
      setIcd10List09(data.data.icd10List09)
      setBananaCodes(data.data.bananaCodes)
      setYellowCodes(data.data.yellowCodes)
      setIcd10List10(data.data.icd10List10)
      setMaraCodes(data.data.maraCodes)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // ✅ ปิด Loading เมื่อโหลดเสร็จ
    }
  };

  useEffect(() => {
    fetchSettingData()
  }, []);

  const exportTableToExcel12 = () => {
    const table = document.querySelector("#table12"); // เลือกตารางที่ต้องการ export
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(data, "hosxp_price.xlsx");
  };

  const exportTableToExcel22 = () => {
    const table = document.querySelector("#table22"); // เลือกตารางที่ต้องการ export
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(data, "hosxp_drug.xlsx");
  };

  const updateData = async () => {
    const data = {
      mainDep,
      oic_n,
      oic_c,
      oic_o,
      oic_l,
      otc_o,
      otc_l,
      pcodeA2,
      pcodeUC,
      pcodeA7,
      icd10List01,
      providerCodes01,
      providerCodes081,
      plaiCodes,
      praCodes,
      priangCodes,
      taraCodes,
      prikCodes,
      icd10List02,
      fahCodes,
      maweangCodes,
      pomCodes,
      treeplaCodes,
      prapCodes,
      icd10List03,
      cuminCodes,
      tardCodes,
      khingCodes,
      icd10List041,
      petCodes,
      icd10List042,
      kotCodes,
      icd10List05,
      nawakotCodes,
      intjakCodes,
      icd10List06,
      lomCodes,
      tamlaiCodes,
      icd10List071,
      payayoCodes,
      icd10List072,
      aloCodes,
      icd10List073,
      mangosteenCodes,
      icd10List074,
      thongCodes,
      icd10List08,
      suksaiCodes,
      jitCodes,
      thcCodes,
      icd10List09,
      bananaCodes,
      yellowCodes,
      icd10List10,
      maraCodes
    }
    try {
      const response = await axios.put("/api/data", data);
      console.log("Updated Data:", response.data);
      Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ",
        timer: 2000,
        showConfirmButton: false,
      });
      setOpen(false);
    } catch (error) {
      console.error("Error updating data:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      {
        isLoading ? ( // ✅ แสดงหน้า Loading เมื่อข้อมูลยังโหลดไม่เสร็จ
          <Loading />
        ) : (
          <div className="app">
            <div className="flex bg-[#ebf7f7]">
              <div className="sub-content">
                <div className="bg-white rounded-lg py-4 mt-4 mb-2 px-4">
                    <div className="text-right">
                      <IconButton
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => setOpen(true)}
                      >
                        <SettingsOutlinedIcon />
                      </IconButton>
                    </div>
                    <p className="text-[0.5rem] sm:text-xl font-normal text-center text-[#02b1a7]">
                      รายงานตัวชี้วัดกลุ่มงานการแพทย์แผนไทยและแพทย์ทางเลือก
                    </p>
                </div>
                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                  fullWidth
                  PaperProps={{
                    sx: {
                      width: "1200px",
                      maxWidth: "90%",
                      maxHeight: "80vh",  // ✅ กำหนดความสูงสูงสุดของ Modal
                      overflow: "hidden"   // ✅ ป้องกัน Modal ใหญ่เกินไป
                    },
                  }}>
                  <div className="p-6 pt-6" style={{ maxHeight: "75vh", overflowY: "auto" }}>
                    <div className="mb-4">
                      <p className="text-center text-[#02b1a7] text-xl">การตั้งค่า</p>
                    </div>
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <p className="text-[#02b1a7] text-base mb-2">
                          บริการทางการแพทย์แผนไทย
                        </p>
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={4} sm={3}>
                            <TextField
                              label="รหัสแผนก (mainDep)"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setMainDep(e.target.value)}
                              value={mainDep}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={4} sm={3}>
                            <TextField
                              label="รหัสหัตถการนวด"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setOic_n(e.target.value)}
                              value={oic_n}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={4} sm={3}>
                            <TextField
                              label="รหัสหัตถการประคบ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setOic_c(e.target.value)}
                              value={oic_c}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={4} sm={3}>
                            <TextField
                              label="รหัสหัตถการอบสมุนไพร"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setOic_o(e.target.value)}
                              value={oic_o}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={4} sm={3}>
                            <TextField
                              label="รหัสหัตถการทับหม้อเกลือ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setOic_l(e.target.value)}
                              value={oic_l}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={4} sm={3}>
                            <TextField
                              label="รหัสประเภทการบำบัด"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setOtc_o(e.target.value)}
                              value={otc_o}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={4} sm={3}>
                            <TextField
                              label="รหัสประเภทการส่งเสริม"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setOtc_l(e.target.value)}
                              value={otc_l}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={4} sm={3}>
                            <TextField
                              label="pcode สิทธิจ่ายตรง"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setPcodeA2(e.target.value)}
                              value={pcodeA2}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={4} sm={3}>
                            <TextField
                              label="pcode สิทธิ UC"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setPcodeUC(e.target.value)}
                              value={pcodeUC}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={4} sm={3}>
                            <TextField
                              label="pcode สิทธิประกันสังคม"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setPcodeA7(e.target.value)}
                              value={pcodeA7}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={4} sm={3}>
                            <TextField
                              label="รหัสประเภทแพทย์แผนปัจจุบัน"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setProviderCodes01(e.target.value)}
                              value={providerCodes01}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={4} sm={3}>
                            <TextField
                              label="รหัสประเภทแพทย์แผนไทย"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setProviderCodes081(e.target.value)}
                              value={providerCodes081}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <p className="text-[#02b1a7] text-base mb-2">
                          กลุ่มอาการปวดกล้ามเนื้อและปวดข้อ
                        </p>
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={16} sm={16}>
                            <TextField
                              label="icd10 ตามกลุ่มอาการ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIcd10List01(e.target.value)}
                              value={icd10List01}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ไพล"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setPlaiCodes(e.target.value)}
                              value={plaiCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ลูกประคบ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setPraCodes(e.target.value)}
                              value={praCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode เถาวัลย์เปรียง"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setPriangCodes(e.target.value)}
                              value={priangCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode สหัสธารา"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setTaraCodes(e.target.value)}
                              value={taraCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode พริก"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setPrikCodes(e.target.value)}
                              value={prikCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <p className="text-[#02b1a7] text-base mb-2">
                          กลุ่มอาการไข้หวัด ไอ เสมหะ โควิด-19
                        </p>
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={16} sm={16}>
                            <TextField
                              label="icd10 ตามกลุ่มอาการ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIcd10List02(e.target.value)}
                              value={icd10List02}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ฟ้าทะลายโจร"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setFahCodes(e.target.value)}
                              value={fahCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ประสะมะแว้ง"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setMaweangCodes(e.target.value)}
                              value={maweangCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ยาแก้ไอมะขามป้อม"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setPomCodes(e.target.value)}
                              value={pomCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ตรีผลา"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setTreeplaCodes(e.target.value)}
                              value={treeplaCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ยาปราบชมพูทวีป"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setPrapCodes(e.target.value)}
                              value={prapCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <p className="text-[#02b1a7] text-base mb-2">
                          กลุ่มอาการท้องอืด ท้องเฟ้อ
                        </p>
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={16} sm={16}>
                            <TextField
                              label="icd10 ตามกลุ่มอาการ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIcd10List03(e.target.value)}
                              value={icd10List03}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ขมิ้นชัน"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setCuminCodes(e.target.value)}
                              value={cuminCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ธาตุอบเชย"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setTardCodes(e.target.value)}
                              value={tardCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ขิง"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setKhingCodes(e.target.value)}
                              value={khingCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <p className="text-[#02b1a7] text-base mb-2">
                          กลุ่มอาการริดสีดวงทวารหนัก
                        </p>
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={16} sm={16}>
                            <TextField
                              label="icd10 ตามกลุ่มอาการ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIcd10List041(e.target.value)}
                              value={icd10List041}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ยาเพชรสังฆาต"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setPetCodes(e.target.value)}
                              value={petCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                        <p className="text-[#02b1a7] text-base mb-2">
                          กลุ่มอาการท้องผูก
                        </p>
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={16} sm={16}>
                            <TextField
                              label="icd10 ตามกลุ่มอาการ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIcd10List042(e.target.value)}
                              value={icd10List042}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode มะขามแขก"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setKotCodes(e.target.value)}
                              value={kotCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <p className="text-[#02b1a7] text-base mb-2">
                          กลุ่มอาการวิงเวียน/คลื่นไส้ อาเจียน
                        </p>
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={16} sm={16}>
                            <TextField
                              label="icd10 ตามกลุ่มอาการ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIcd10List05(e.target.value)}
                              value={icd10List05}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ยาขิง"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setKhingCodes(e.target.value)}
                              value={khingCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ยาหอมนวโกฐ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setNawakotCodes(e.target.value)}
                              value={nawakotCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ยาหอมอินทจักร์"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIntjakCodes(e.target.value)}
                              value={intjakCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <p className="text-[#02b1a7] text-base mb-2">
                          กลุ่มอาการชาจากอัมพฤกษ์-อัมพาต
                        </p>
                        <Grid container spacing={2} className="mb-4">
                          <Grid item xs={16} sm={16}>
                            <TextField
                              label="icd10 ตามกลุ่มอาการ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIcd10List06(e.target.value)}
                              value={icd10List06}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ตำรับยาแก้ลมแก้เส้น"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setLomCodes(e.target.value)}
                              value={lomCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ยาทำลายพระสุเมรุ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setTamlaiCodes(e.target.value)}
                              value={tamlaiCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <p className="text-[#02b1a7] text-base mb-2">
                          กลุ่มอาการทางผิวหนังและแผล_1
                        </p>
                        <Grid container spacing={2} className="mb-4">
                          <Grid item xs={16} sm={16}>
                            <TextField
                              label="icd10 ตามกลุ่มอาการ_พยายอ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIcd10List071(e.target.value)}
                              value={icd10List071}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode พยายอ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setPayayoCodes(e.target.value)}
                              value={payayoCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                        <p className="text-[#02b1a7] text-base mb-2">
                          กลุ่มอาการทางผิวหนังและแผล_2
                        </p>
                        <Grid container spacing={2} className="mb-4">
                          <Grid item xs={16} sm={16}>
                            <TextField
                              label="icd10 ตามกลุ่มอาการ_ว่านหางจระเข้"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIcd10List072(e.target.value)}
                              value={icd10List072}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ว่านหางจระเข้"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setAloCodes(e.target.value)}
                              value={aloCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                        <p className="text-[#02b1a7] text-base mb-2">
                          กลุ่มอาการทางผิวหนังและแผล_3
                        </p>
                        <Grid container spacing={2} className="mb-4">
                          <Grid item xs={16} sm={16}>
                            <TextField
                              label="icd10 ตามกลุ่มอาการ_ยาเปลือกมังคุด"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIcd10List073(e.target.value)}
                              value={icd10List073}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ยาเปลือกมังคุด"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setMangosteenCodes(e.target.value)}
                              value={mangosteenCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                        <p className="text-[#02b1a7] text-base mb-2">
                          กลุ่มอาการทางผิวหนังและแผล_4
                        </p>
                        <Grid container spacing={2} className="mb-4">
                          <Grid item xs={16} sm={16}>
                            <TextField
                              label="icd10 ตามกลุ่มอาการ_ยาทิงเจอร์ทองพันชั่ง"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIcd10List074(e.target.value)}
                              value={icd10List074}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ยาทิงเจอร์ทองพันชั่ง"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setThongCodes(e.target.value)}
                              value={thongCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <p className="text-[#02b1a7] text-base mb-2">
                          อาการนอนไม่หลับ
                        </p>
                        <Grid container spacing={2} className="mb-4">
                          <Grid item xs={16} sm={16}>
                            <TextField
                              label="icd10 ตามกลุ่มอาการ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIcd10List08(e.target.value)}
                              value={icd10List08}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ยาศุขไสยาศน์"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setSuksaiCodes(e.target.value)}
                              value={suksaiCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ยาหอมเทพจิตร"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setJitCodes(e.target.value)}
                              value={jitCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode น้ำมันกัญชา THC 20 mg/ml"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setThcCodes(e.target.value)}
                              value={thcCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <p className="text-[#02b1a7] text-base mb-2">
                          กลุ่มอาการท้องเสีย
                        </p>
                        <Grid container spacing={2} className="mb-4">
                          <Grid item xs={16} sm={16}>
                            <TextField
                              label="icd10 ตามกลุ่มอาการ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIcd10List09(e.target.value)}
                              value={icd10List09}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ฟ้าทะลายโจร"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setFahCodes(e.target.value)}
                              value={fahCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ยากล้วย"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setBananaCodes(e.target.value)}
                              value={bananaCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ยาเหลืองปิดสมุทร"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setYellowCodes(e.target.value)}
                              value={yellowCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <p className="text-[#02b1a7] text-base mb-2">
                          กลุ่มอาการเบื่ออาหาร
                        </p>
                        <Grid container spacing={2} className="mb-4">
                          <Grid item xs={16} sm={16}>
                            <TextField
                              label="icd10 ตามกลุ่มอาการ"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setIcd10List10(e.target.value)}
                              value={icd10List10}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode ยามะระขี้นก"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setMaraCodes(e.target.value)}
                              value={maraCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              label="icode น้ำมันกัญชา THC 20 mg/ml"
                              variant="standard"
                              fullWidth
                              onChange={(e) => setThcCodes(e.target.value)}
                              value={thcCodes}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": { borderColor: "#02b1a7" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#02b1a7" },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    <div className="flex justify-center gap-2">
                      <Button onClick={updateData} color="primary" variant="contained">
                        บันทึก
                      </Button>
                      <Button onClick={() => setOpen(false)} color="error" variant="contained">
                        ปิด
                      </Button>
                    </div>
                  </div>
                </Dialog>
                <div className="flex justify-center items-start p-6 bg-white shadow-lg rounded-lg w-full mb-2">
                  <div>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                      <p className="text-[0.5rem] sm:text-lg font-normal text-[#02b1a7]">เลือกช่วงวันที่</p>
                      <div className="flex flex-col">
                        <label className="text-gray-600 text-sm mb-1">ตั้งแต่วันที่:</label>
                        <DatePicker
                          selected={startDate}
                          onChange={handleStartDateChange}
                          locale="th"
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown
                          showMonthDropdown
                          className="border border-gray-300 rounded-lg p-2 w-full max-w-xs text-gray-700"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-gray-600 text-sm mb-1">ถึงวันที่:</label>
                        <DatePicker
                          selected={endDate}
                          onChange={handleEndDateChange}
                          locale="th"
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown
                          showMonthDropdown
                          className="border border-gray-300 rounded-lg p-2 w-full max-w-xs text-gray-700"
                        />
                      </div>
                      <button
                        onClick={handleSubmit}
                        className={`px-6 py-2 rounded-lg transition ${error ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                          }`}
                        disabled={!!error} // ปิดปุ่มถ้ามีข้อผิดพลาด
                      >
                        ค้นหา
                      </button>
                    </div>
                    <div className="flex justify-center items-center">
                      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                  </div>
                </div>
                <div className="p-4 mb-2 bg-gray-50 rounded-lg shadow-lg overflow-x-auto">
                  <p className="text-center text-[0.5rem] sm:text-lg font-normal text-[#02b1a7] mt-4 mb-8">
                    1. รายรับจากการให้บริการผู้ป่วยนอกที่ได้รับการบริการด้านการแพทย์แผนไทยและการแพทย์ทางเลือกที่ได้มาตรฐานต่อจำนวนครั้งการให้บริการผู้ป่วยนอก
                  </p>
                  <p className="text-center">
                    1.1 ข้อมูลจาก HosXP
                  </p>
                  <div className="mb-4 mr-4 flex justify-end items-center">
                    <button
                      onClick={exportTableToExcel12}
                      className="px-4 py-2 text-[0.5rem] sm:text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Export to Excel
                    </button>
                  </div>
                  <div className="overflow-y-hidden overflow-x-scroll mb-4">
                    <table aria-label="data table" id="table12" className="table-fixed border-collapse text-[0.5rem]  sm:text-sm border border-slate-500">
                      <thead>
                        <tr>
                          <td rowSpan="3" className="text-center bg-[#41dfd7] border border-slate-600 min-w-[80px] sm:min-w-[150px]">จำนวนบริการผู้ป่วยนอกทั้งหมด</td>
                          <td rowSpan="3" className="text-center bg-[#41dfd7] border border-slate-600 min-w-[80px] sm:min-w-[150px]">จำนวนบริการแพทย์แผนไทยทั้งหมด</td>
                          <td rowSpan="3" className="text-center bg-[#41dfd7] border border-slate-600 min-w-[80px] sm:min-w-[150px]">มูลค่ายาสมุนไพร</td>
                          <td colSpan="8" className="text-center bg-[#41dfd7] h-6 sm:h-10 border border-slate-600 ">นวด</td>
                          <td colSpan="8" className="text-center bg-[#41dfd7] border border-slate-600 ">ประคบสมุนไพร</td>
                          <td colSpan="8" className="text-center bg-[#41dfd7] border border-slate-600 ">นวดและประคบ</td>
                          <td colSpan="8" className="text-center bg-[#41dfd7] border border-slate-600 ">อบสมุนไพร</td>
                          <td colSpan="8" className="text-center bg-[#41dfd7] border border-slate-600 ">การบริบาลหญิงหลังคลอด</td>
                          <td rowSpan="3" className="text-center bg-[#41dfd7] border border-slate-600 min-w-[80px] sm:min-w-[150px]">รวมทั้งสิ้น</td>
                          <td rowSpan="3" className="text-center bg-[#41dfd7] border border-slate-600 min-w-[80px] sm:min-w-[150px]">รายรับต่อครั้ง</td>
                        </tr>
                        <tr>
                          <td colSpan="2" className="text-center bg-[#41dfd7] h-6 sm:h-10 border border-slate-600">สิทธิ UC</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] border border-slate-600">สิทธิจ่ายตรง</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] h-6 sm:h-10 border border-slate-600">สิทธิประกันสังคม</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] border border-slate-600">สิทธิอื่น ๆ</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] h-6 sm:h-10 border border-slate-600">สิทธิ UC</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] border border-slate-600">สิทธิจ่ายตรง</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] h-6 sm:h-10 border border-slate-600">สิทธิประกันสังคม</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] border border-slate-600">สิทธิอื่น ๆ</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] h-6 sm:h-10 border border-slate-600">สิทธิ UC</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] border border-slate-600">สิทธิจ่ายตรง</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] h-6 sm:h-10 border border-slate-600">สิทธิประกันสังคม</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] border border-slate-600">สิทธิอื่น ๆ</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] h-6 sm:h-10 border border-slate-600">สิทธิ UC</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] border border-slate-600">สิทธิจ่ายตรง</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] h-6 sm:h-10 border border-slate-600">สิทธิประกันสังคม</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] border border-slate-600">สิทธิอื่น ๆ</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] h-6 sm:h-10 border border-slate-600">สิทธิ UC</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] border border-slate-600">สิทธิจ่ายตรง</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] h-6 sm:h-10 border border-slate-600">สิทธิประกันสังคม</td>
                          <td colSpan="2" className="text-center bg-[#41dfd7] border border-slate-600">สิทธิอื่น ๆ</td>
                        </tr>
                        <tr>
                          {Array(40).fill(null).map((_, index) => (
                            <td
                              key={index}
                              className="text-center h-6 sm:h-10 bg-[#41dfd7] border border-slate-600 min-w-[80px] sm:min-w-[150px]"
                            >
                              {index % 2 === 0 ? "จำนวน" : "เป็นเงิน"}
                            </td>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={"bg-white"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPService?.op_visit?.toLocaleString()}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPService?.ttm_visit?.toLocaleString()}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPService?.ttm_drug_sum_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || ""}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_n_uc - hosXPService.ttm_np_uc) ? "" : (hosXPService.ttm_n_uc - hosXPService.ttm_np_uc).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_n_uc - hosXPService.ttm_np_uc) ? "" : (((hosXPService.ttm_n_uc - hosXPService.ttm_np_uc) * 200).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_n_a2 - hosXPService.ttm_np_a2) ? "" : (hosXPService.ttm_n_a2 - hosXPService.ttm_np_a2).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_n_a2 - hosXPService.ttm_np_a2) ? "" : (((hosXPService.ttm_n_a2 - hosXPService.ttm_np_a2) * 200).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_n_a7 - hosXPService.ttm_np_a7) ? "" : (hosXPService.ttm_n_a7 - hosXPService.ttm_np_a7).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_n_a7 - hosXPService.ttm_np_a7) ? "" : (((hosXPService.ttm_n_a7 - hosXPService.ttm_np_a7) * 200).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_n_other - hosXPService.ttm_np_other) ? "" : (hosXPService.ttm_n_other - hosXPService.ttm_np_other).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_n_other - hosXPService.ttm_np_other) ? "" : (((hosXPService.ttm_n_other - hosXPService.ttm_np_other) * 200).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_p_uc - hosXPService.ttm_np_uc) ? "" : (hosXPService.ttm_p_uc - hosXPService.ttm_np_uc).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_p_uc - hosXPService.ttm_np_uc) ? "" : (((hosXPService.ttm_p_uc - hosXPService.ttm_np_uc) * 150).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_p_a2 - hosXPService.ttm_np_a2) ? "" : (hosXPService.ttm_p_a2 - hosXPService.ttm_np_a2).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_p_a2 - hosXPService.ttm_np_a2) ? "" : (((hosXPService.ttm_p_a2 - hosXPService.ttm_np_a2) * 150).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_p_a7 - hosXPService.ttm_np_a7) ? "" : (hosXPService.ttm_p_a7 - hosXPService.ttm_np_a7).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_p_a7 - hosXPService.ttm_np_a7) ? "" : (((hosXPService.ttm_p_a7 - hosXPService.ttm_np_a7) * 150).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_p_other - hosXPService.ttm_np_other) ? "" : (hosXPService.ttm_p_other - hosXPService.ttm_np_other).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{Number.isNaN(hosXPService.ttm_p_other - hosXPService.ttm_np_other) ? "" : (((hosXPService.ttm_p_other - hosXPService.ttm_np_other) * 150).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_np_uc)) ? "" : Number(hosXPService.ttm_np_uc).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_np_uc)) ? "" : ((hosXPService.ttm_np_uc * 250).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_np_a2)) ? "" : Number(hosXPService.ttm_np_a2).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_np_a2)) ? "" : ((hosXPService.ttm_np_a2 * 250).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_np_a7)) ? "" : Number(hosXPService.ttm_np_a7).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_np_a7)) ? "" : ((hosXPService.ttm_np_a7 * 250).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_np_other)) ? "" : Number(hosXPService.ttm_np_other).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_np_other)) ? "" : ((hosXPService.ttm_np_other * 250).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_o_uc)) ? "" : Number(hosXPService.ttm_o_uc).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_o_uc)) ? "" : ((hosXPService.ttm_o_uc * 120).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_o_a2)) ? "" : Number(hosXPService.ttm_o_a2).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_o_a2)) ? "" : ((hosXPService.ttm_o_a2 * 120).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_o_a7)) ? "" : Number(hosXPService.ttm_o_a7).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_o_a7)) ? "" : ((hosXPService.ttm_o_a7 * 120).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_o_other)) ? "" : Number(hosXPService.ttm_o_other).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_o_other)) ? "" : ((hosXPService.ttm_o_other * 120).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_labor_uc)) ? "" : Number(hosXPService.ttm_labor_uc).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_labor_uc)) ? "" : ((hosXPService.ttm_labor_uc * 500).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_labor_a2)) ? "" : Number(hosXPService.ttm_labor_a2).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_labor_a2)) ? "" : ((hosXPService.ttm_labor_a2 * 620).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_labor_a7)) ? "" : Number(hosXPService.ttm_labor_a7).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_labor_a7)) ? "" : ((hosXPService.ttm_labor_a7 * 620).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_labor_other)) ? "" : Number(hosXPService.ttm_labor_other).toLocaleString()}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">{isNaN(Number(hosXPService?.ttm_labor_other)) ? "" : ((hosXPService.ttm_labor_other * 620).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">
                            {isNaN(
                              Number(hosXPService?.ttm_drug_sum_price) +
                              ((Number(hosXPService?.ttm_n_uc) - Number(hosXPService?.ttm_np_uc)) * 200) +
                              ((Number(hosXPService?.ttm_n_a2) - Number(hosXPService?.ttm_np_a2)) * 200) +
                              ((Number(hosXPService?.ttm_n_a7) - Number(hosXPService?.ttm_np_a7)) * 200) +
                              ((Number(hosXPService?.ttm_n_other) - Number(hosXPService?.ttm_np_other)) * 200) +
                              ((Number(hosXPService?.ttm_p_uc) - Number(hosXPService?.ttm_np_uc)) * 150) +
                              ((Number(hosXPService?.ttm_p_a2) - Number(hosXPService?.ttm_np_a2)) * 150) +
                              ((Number(hosXPService?.ttm_p_a7) - Number(hosXPService?.ttm_np_a7)) * 150) +
                              ((Number(hosXPService?.ttm_p_other) - Number(hosXPService?.ttm_np_other)) * 150) +
                              (Number(hosXPService?.ttm_np_uc) * 250) +
                              (Number(hosXPService?.ttm_np_a2) * 250) +
                              (Number(hosXPService?.ttm_np_a7) * 250) +
                              (Number(hosXPService?.ttm_np_other) * 250) +
                              (Number(hosXPService?.ttm_o_uc) * 120) +
                              (Number(hosXPService?.ttm_o_a2) * 120) +
                              (Number(hosXPService?.ttm_o_a7) * 120) +
                              (Number(hosXPService?.ttm_o_other) * 120) +
                              (Number(hosXPService?.ttm_labor_uc) * 500) +
                              (Number(hosXPService?.ttm_labor_a2) * 620) +
                              (Number(hosXPService?.ttm_labor_a7) * 620) +
                              (Number(hosXPService?.ttm_labor_other) * 620)
                            ) ? "" : (
                              (
                                Number(hosXPService?.ttm_drug_sum_price) +
                                ((Number(hosXPService?.ttm_n_uc) - Number(hosXPService?.ttm_np_uc)) * 200) +
                                ((Number(hosXPService?.ttm_n_a2) - Number(hosXPService?.ttm_np_a2)) * 200) +
                                ((Number(hosXPService?.ttm_n_a7) - Number(hosXPService?.ttm_np_a7)) * 200) +
                                ((Number(hosXPService?.ttm_n_other) - Number(hosXPService?.ttm_np_other)) * 200) +
                                ((Number(hosXPService?.ttm_p_uc) - Number(hosXPService?.ttm_np_uc)) * 150) +
                                ((Number(hosXPService?.ttm_p_a2) - Number(hosXPService?.ttm_np_a2)) * 150) +
                                ((Number(hosXPService?.ttm_p_a7) - Number(hosXPService?.ttm_np_a7)) * 150) +
                                ((Number(hosXPService?.ttm_p_other) - Number(hosXPService?.ttm_np_other)) * 150) +
                                (Number(hosXPService?.ttm_np_uc) * 250) +
                                (Number(hosXPService?.ttm_np_a2) * 250) +
                                (Number(hosXPService?.ttm_np_a7) * 250) +
                                (Number(hosXPService?.ttm_np_other) * 250) +
                                (Number(hosXPService?.ttm_o_uc) * 120) +
                                (Number(hosXPService?.ttm_o_a2) * 120) +
                                (Number(hosXPService?.ttm_o_a7) * 120) +
                                (Number(hosXPService?.ttm_o_other) * 120) +
                                (Number(hosXPService?.ttm_labor_uc) * 500) +
                                (Number(hosXPService?.ttm_labor_a2) * 620) +
                                (Number(hosXPService?.ttm_labor_a7) * 620) +
                                (Number(hosXPService?.ttm_labor_other) * 620)
                              ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            )}
                          </td>
                          <td className="text-right pr-4 h-6 sm:h-10 border border-slate-400">
                            {Number(hosXPService?.op_visit) === 0
                              ? 0
                              : isNaN(
                                (Number(hosXPService?.ttm_drug_sum_price) +
                                  ((Number(hosXPService?.ttm_n_uc) - Number(hosXPService?.ttm_np_uc)) * 200) +
                                  ((Number(hosXPService?.ttm_n_a2) - Number(hosXPService?.ttm_np_a2)) * 200) +
                                  ((Number(hosXPService?.ttm_n_a7) - Number(hosXPService?.ttm_np_a7)) * 200) +
                                  ((Number(hosXPService?.ttm_n_other) - Number(hosXPService?.ttm_np_other)) * 200) +
                                  ((Number(hosXPService?.ttm_p_uc) - Number(hosXPService?.ttm_np_uc)) * 150) +
                                  ((Number(hosXPService?.ttm_p_a2) - Number(hosXPService?.ttm_np_a2)) * 150) +
                                  ((Number(hosXPService?.ttm_p_a7) - Number(hosXPService?.ttm_np_a7)) * 150) +
                                  ((Number(hosXPService?.ttm_p_other) - Number(hosXPService?.ttm_np_other)) * 150) +
                                  (Number(hosXPService?.ttm_np_uc) * 250) +
                                  (Number(hosXPService?.ttm_np_a2) * 250) +
                                  (Number(hosXPService?.ttm_np_a7) * 250) +
                                  (Number(hosXPService?.ttm_np_other) * 250) +
                                  (Number(hosXPService?.ttm_o_uc) * 120) +
                                  (Number(hosXPService?.ttm_o_a2) * 120) +
                                  (Number(hosXPService?.ttm_o_a7) * 120) +
                                  (Number(hosXPService?.ttm_o_other) * 120) +
                                  (Number(hosXPService?.ttm_labor_uc) * 500) +
                                  (Number(hosXPService?.ttm_labor_a2) * 620) +
                                  (Number(hosXPService?.ttm_labor_a7) * 620) +
                                  (Number(hosXPService?.ttm_labor_other) * 620)) / Number(hosXPService?.op_visit)
                              )
                                ? ""
                                : (
                                  (
                                    (Number(hosXPService?.ttm_drug_sum_price) +
                                      ((Number(hosXPService?.ttm_n_uc) - Number(hosXPService?.ttm_np_uc)) * 200) +
                                      ((Number(hosXPService?.ttm_n_a2) - Number(hosXPService?.ttm_np_a2)) * 200) +
                                      ((Number(hosXPService?.ttm_n_a7) - Number(hosXPService?.ttm_np_a7)) * 200) +
                                      ((Number(hosXPService?.ttm_n_other) - Number(hosXPService?.ttm_np_other)) * 200) +
                                      ((Number(hosXPService?.ttm_p_uc) - Number(hosXPService?.ttm_np_uc)) * 150) +
                                      ((Number(hosXPService?.ttm_p_a2) - Number(hosXPService?.ttm_np_a2)) * 150) +
                                      ((Number(hosXPService?.ttm_p_a7) - Number(hosXPService?.ttm_np_a7)) * 150) +
                                      ((Number(hosXPService?.ttm_p_other) - Number(hosXPService?.ttm_np_other)) * 150) +
                                      (Number(hosXPService?.ttm_np_uc) * 250) +
                                      (Number(hosXPService?.ttm_np_a2) * 250) +
                                      (Number(hosXPService?.ttm_np_a7) * 250) +
                                      (Number(hosXPService?.ttm_np_other) * 250) +
                                      (Number(hosXPService?.ttm_o_uc) * 120) +
                                      (Number(hosXPService?.ttm_o_a2) * 120) +
                                      (Number(hosXPService?.ttm_o_a7) * 120) +
                                      (Number(hosXPService?.ttm_o_other) * 120) +
                                      (Number(hosXPService?.ttm_labor_uc) * 500) +
                                      (Number(hosXPService?.ttm_labor_a2) * 620) +
                                      (Number(hosXPService?.ttm_labor_a7) * 620) +
                                      (Number(hosXPService?.ttm_labor_other) * 620)) / Number(hosXPService?.op_visit)
                                  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                )
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="p-4 mb-2 bg-gray-50 rounded-lg shadow-lg overflow-x-auto">
                  <p className="text-center text-[0.5rem] sm:text-lg font-normal text-[#02b1a7] mt-4 mb-8">
                    2. ร้อยละของผู้ป่วยที่ได้รับการวินิจฉัยโรค Common Diseases and Symptoms ได้รับยาสมุนไพรเพิ่มขึ้น
                  </p>
                  <p className="text-center">
                    2.1 ข้อมูลจาก HosXP
                  </p>
                  <div className="mb-4 mr-4 flex justify-end items-center">
                    <button
                      onClick={exportTableToExcel22}
                      className="px-4 py-2 text-[0.5rem] sm:text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Export to Excel
                    </button>
                  </div>
                  <div className="overflow-x-auto w-full">
                    <table aria-label="data table" id="table22" className="w-full table-fixed border-collapse text-[0.5rem] sm:text-sm border border-slate-500">
                      <thead>
                        <tr>
                          <td rowSpan="2" className="text-center h-10 bg-[#41dfd7] z-10 border border-slate-600 w-[100px] sm:w-[180px]">
                            กลุ่มอาการ
                          </td>
                          <td rowSpan="2" className="text-center h-10 bg-[#41dfd7] z-10 border border-slate-600 w-[80px] sm:w-[100px]">
                            รายการยา
                          </td>
                          <td colSpan="2" className="text-center h-10 bg-[#41dfd7] border border-slate-600 w-[80px] sm:w-[100px]">
                            รวมทุกวิชาชีพ
                          </td>
                          <td colSpan="2" className="text-center h-10 bg-[#41dfd7] border border-slate-600 w-[80px] sm:w-[100px]">
                            แพทย์แผนปัจจุบัน
                          </td>
                          <td colSpan="2" className="text-center h-10 bg-[#41dfd7] border border-slate-600 w-[80px] sm:w-[100px]">
                            แพทย์แผนไทย
                          </td>
                          <td colSpan="2" className="text-center h-10 bg-[#41dfd7] border border-slate-600 w-[80px] sm:w-[100px]">
                            วิชาชีพอื่น ๆ
                          </td>
                        </tr>
                        <tr>
                          <td className="text-center h-10 bg-[#41dfd7] border border-slate-600 w-[80px] sm:w-[100px]">Dx</td>
                          <td className="text-center h-10 bg-[#41dfd7] border border-slate-600 w-[80px] sm:w-[100px]">Dx+Drug</td>
                          <td className="text-center h-10 bg-[#41dfd7] border border-slate-600 w-[80px] sm:w-[100px]">Dx</td>
                          <td className="text-center h-10 bg-[#41dfd7] border border-slate-600 w-[80px] sm:w-[100px]">Dx+Drug</td>
                          <td className="text-center h-10 bg-[#41dfd7] border border-slate-600 w-[80px] sm:w-[100px]">Dx</td>
                          <td className="text-center h-10 bg-[#41dfd7] border border-slate-600 w-[80px] sm:w-[100px]">Dx+Drug</td>
                          <td className="text-center h-10 bg-[#41dfd7] border border-slate-600 w-[80px] sm:w-[100px]">Dx</td>
                          <td className="text-center h-10 bg-[#41dfd7] border border-slate-600 w-[80px] sm:w-[100px]">Dx+Drug</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={"bg-white"}>
                          <td rowSpan="5" className="text-left pl-4  h-6 sm:h-10 border border-slate-400">
                            1. กลุ่มอาการปวดกล้ามเนื้อและปวดข้อ
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            เถาวัลย์เปรียง
                          </td>
                          <td rowSpan="5" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_priang}
                          </td>
                          <td rowSpan="5" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_01}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_01_priang}
                          </td>
                          <td rowSpan="5" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_081}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_081_priang}
                          </td>
                          <td rowSpan="5" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_099}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_099_priang}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            สหัสธารา
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_tara}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_01_tara}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_081_tara}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_099_tara}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ไพล
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_plai}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_01_plai}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_081_plai}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_099_plai}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ลูกประคบ
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_pra}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_01_pra}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_081_pra}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_099_pra}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาพริก
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_prik}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_01_prik}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_081_prik}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_01_all_099_prik}
                          </td>
                        </tr>
                        <tr className={"bg-[#befdfa]"}>
                          <td rowSpan="5" className="text-left pl-4  h-6 sm:h-10 border border-slate-400">
                            2. กลุ่มอาการไข้หวัด ไอ เสมหะ โควิด-19
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ฟ้าทะลายโจร/สารสกัด
                          </td>
                          <td rowSpan="5" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_all}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_all_fah}
                          </td>
                          <td rowSpan="5" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_01}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_01_fah}
                          </td>
                          <td rowSpan="5" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_081}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_081_fah}
                          </td>
                          <td rowSpan="5" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_099}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_099_fah}
                          </td>
                        </tr>
                        <tr className={"bg-[#befdfa]"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาประสะมะแว้ง
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_all_maweang}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_01_maweang}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_081_maweang}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_099_maweang}
                          </td>
                        </tr>
                        <tr className={"bg-[#befdfa]"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาแก้ไอมะขามป้อม
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_all_pom}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_01_pom}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_081_pom}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_099_pom}
                          </td>
                        </tr>
                        <tr className={"bg-[#befdfa]"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาตรีผลา
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_all_treepla}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_01_treepla}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_081_treepla}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_099_treepla}
                          </td>
                        </tr>
                        <tr className={"bg-[#befdfa]"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาปราบชมพูทวีป
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_all_prap}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_01_prap}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_081_prap}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_02_099_prap}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td rowSpan="3" className="text-left pl-4  h-6 sm:h-10 border border-slate-400">
                            3. กลุ่มอาการท้องอืด ท้องเฟ้อ
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ขมิ้นชัน
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_all}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_all_cumin}
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_01}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_01_cumin}
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_081}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_081_cumin}
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_099}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_099_cumin}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ธาตุอบเชย
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_all_tard}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_01_tard}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_081_tard}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_099_tard}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ขิง
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_all_khing}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_01_khing}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_081_khing}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_03_099_khing}
                          </td>
                        </tr>
                        <tr className={"bg-[#befdfa]"}>
                          <td rowSpan="2" className="text-left pl-4  h-6 sm:h-10 border border-slate-400">
                            4. กลุ่มอาการริดสีดวงทวารหนัก และท้องผูก
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาเพชรสังฆาต
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_041_all}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_041_all_pet}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_041_01}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_041_01_pet}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_041_081}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_041_081_pet}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_041_099}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_041_099_pet}
                          </td>
                        </tr>
                        <tr className={"bg-[#befdfa]"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            มะขามแขก
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_042_all}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_042_all_kot}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_042_01}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_042_01_kot}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_042_081}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_042_081_kot}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_042_099}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_042_099_kot}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td rowSpan="3" className="text-left pl-4  h-6 sm:h-10 border border-slate-400">
                            5. กลุ่มอาการวิงเวียน/คลื่นไส้ อาเจียน
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาขิง
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_all}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_all_khing}
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_01}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_01_khing}
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_081}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_081_khing}
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_099}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_099_khing}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาหอมนวโกฐ
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_all_nawakot}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_01_nawakot}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_081_nawakot}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_099_nawakot}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาหอมอินทจักร์
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_all_intjak}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_01_intjak}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_081_intjak}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_05_099_intjak}
                          </td>
                        </tr>
                        <tr className={"bg-[#befdfa]"}>
                          <td rowSpan="2" className="text-left pl-4  h-6 sm:h-10 border border-slate-400">
                            6. กลุ่มอาการชาจากอัมพฤกษ์-อัมพาต
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ตำรับยาแก้ลมแก้เส้น
                          </td>
                          <td rowSpan="2" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_06_all}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_06_all_lom}
                          </td>
                          <td rowSpan="2" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_06_01}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_06_01_lom}
                          </td>
                          <td rowSpan="2" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_06_081}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_06_081_lom}
                          </td>
                          <td rowSpan="2" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_06_099}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_06_099_lom}
                          </td>
                        </tr>
                        <tr className={"bg-[#befdfa]"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาทำลายพระสุเมรุ
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_06_all_tamlai}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_06_01_tamlai}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_06_081_tamlai}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_06_099_tamlai}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td rowSpan="4" className="text-left pl-4  h-6 sm:h-10 border border-slate-400">
                            7. กลุ่มอาการทางผิวหนัง/แผล
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            พยายอ
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_071_all}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_071_all_payayo}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_071_01}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_071_01_payayo}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_071_081}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_071_081_payayo}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_071_099}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_071_099_payayo}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาว่านหางจระเข้
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_072_all}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_072_all_alo}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_072_01}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_072_01_alo}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_072_081}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_072_081_alo}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_072_099}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_072_099_alo}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาเปลือกมังคุด
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_073_all}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_073_all_mangosteen}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_073_01}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_073_01_mangosteen}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_073_081}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_073_081_mangosteen}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_073_099}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_073_099_mangosteen}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาทิงเจอร์ทองพันชั่ง
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_074_all}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_074_all_thong}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_074_01}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_074_01_thong}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_074_081}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_074_081_thong}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_074_099}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_074_099_thong}
                          </td>
                        </tr>
                        <tr className={"bg-[#befdfa]"}>
                          <td rowSpan="3" className="text-left pl-4  h-6 sm:h-10 border border-slate-400">
                            8. อาการนอนไม่หลับ
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาศุขไสยาศน์
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_all}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_all_suksai}
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_01}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_01_suksai}
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_081}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_081_suksai}
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_099}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_099_suksai}
                          </td>
                        </tr>
                        <tr className={"bg-[#befdfa]"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาหอมเทพจิตร
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_all_jit}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_01_jit}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_081_jit}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_099_jit}
                          </td>
                        </tr>
                        <tr className={"bg-[#befdfa]"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            น้ำมันกัญชา THC 20 mg/ml
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_all_jit}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_01_jit}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_081_jit}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_08_099_jit}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td rowSpan="3" className="text-left pl-4  h-6 sm:h-10 border border-slate-400">
                            9. กลุ่มอาการท้องเสีย
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ฟ้าทะลายโจร
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_all}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_all_fah}
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_01}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_01_fah}
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_081}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_081_fah}
                          </td>
                          <td rowSpan="3" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_099}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_099_fah}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยากล้วย
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_all_banana}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_01_banana}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_081_banana}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_099_banana}
                          </td>
                        </tr>
                        <tr className={"bg-white"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยาเหลืองปิดสมุทร
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_all_yellow}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_01_yellow}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_081_yellow}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_09_099_yellow}
                          </td>
                        </tr>
                        <tr className={"bg-[#befdfa]"}>
                          <td rowSpan="2" className="text-left pl-4  h-6 sm:h-10 border border-slate-400">
                            10. กลุ่มอาการเบื่ออาหาร
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            ยามะระขี้นก
                          </td>
                          <td rowSpan="2" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_10_all}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_10_all_mara}
                          </td>
                          <td rowSpan="2" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_10_01}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_10_01_mara}
                          </td>
                          <td rowSpan="2" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_10_081}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_10_081_mara}
                          </td>
                          <td rowSpan="2" className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_10_099}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_10_099_mara}
                          </td>
                        </tr>
                        <tr className={"bg-[#befdfa]"}>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            น้ำมันกัญชา THC 20 mg/ml
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_10_all_thc}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_10_01_thc}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_10_081_thc}
                          </td>
                          <td className="text-center h-6 sm:h-10 border border-slate-400">
                            {hosXPDrug.icd10_10_099_thc}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-center items-start p-6 bg-white shadow-lg rounded-lg w-full mb-2">
                  <div className="">
                    <p className="text-[0.25rem] text-center sm:text-sm font-normal text-gray-800">โดย นายอารอฟัต สะบูดิง แพทย์แผนไทยชำนาญการ</p>
                    <p className="text-[0.25rem] text-center sm:text-sm font-normal text-gray-800">โรงพยาบาลสุไหงปาดี จังหวัดนราธิวาส</p>
                    <p className="text-[0.25rem] text-center sm:text-sm font-normal text-gray-800">tel: 090 209 9333 | e-mail: arofat.sa@gmail.com</p>
                  </div>
                </div>
              </div>
            </div >
          </div >
        )
      }
    </>
  );
}