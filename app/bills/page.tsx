const handlePrintDirect = (bill: any) => {
  const waterUnits = Math.max(0, bill.waterNew - bill.waterOld);
  const waterTotal = waterUnits * bill.waterPricePerUnit;
  const electricUnits = Math.max(0, bill.electricNew - bill.electricOld);
  const electricTotal = electricUnits * bill.electricPricePerUnit;

  const printContent = `
    <html>
      <head>
        <title>พิมพ์ใบแจ้งค่าเช่า - ห้อง ${bill.roomNumber}</title>
        <style>
          body { font-family: 'Sarabun', sans-serif; padding: 20px; font-size: 12px; }
          .bill-box { border: 2px solid #000; padding: 20px; max-width: 650px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
          .header h1 { margin: 0; font-size: 20px; }
          .header h2 { margin: 0; font-size: 18px; }
          .info { display: flex; justify-content: space-between; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          th, td { padding: 6px; text-align: left; }
          th { border-top: 1px solid #000; border-bottom: 1px solid #000; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .footer { display: flex; justify-content: space-between; border-top: 1px solid #000; padding-top: 8px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="bill-box">
          <div class="header">
            <div>
              <h1>BAN (DormFlow)</h1>
              <p style="margin: 2px 0 0 0; font-size: 10px;">354 หมู่ 1 ต.วัฒนานคร อ.วัฒนานคร จ.สระแก้ว 27160</p>
              <p style="margin: 0; font-size: 10px;">โทรศัพท์: 089-605-0124</p>
            </div>
            <div><h2>- ใบแจ้งค่าเช่า -</h2></div>
          </div>
          <div class="info">
            <span><strong>ชื่อผู้เช่า:</strong> ${bill.tenantName} | <strong>ห้อง:</strong> ${bill.roomNumber}</span>
            <span><strong>ประจำเดือน:</strong> ${bill.month}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th class="text-center" style="width: 40px;">ลำดับ</th>
                <th>รายการ</th>
                <th class="text-right">หน่วย</th>
                <th class="text-right">ราคา/หน่วย</th>
                <th class="text-right">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">1</td>
                <td>อัตราค่าห้องพัก</td>
                <td class="text-right">1.00</td>
                <td class="text-right">${bill.rentPrice.toFixed(2)}</td>
                <td class="text-right">${bill.rentPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="text-center">2</td>
                <td>ค่าไฟฟ้า (${bill.electricOld} - ${bill.electricNew})</td>
                <td class="text-right">${electricUnits.toFixed(2)}</td>
                <td class="text-right">${bill.electricPricePerUnit.toFixed(2)}</td>
                <td class="text-right">${electricTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="text-center">3</td>
                <td>ค่าน้ำประปา (${bill.waterOld} - ${bill.waterNew})</td>
                <td class="text-right">${waterUnits.toFixed(2)}</td>
                <td class="text-right">${bill.waterPricePerUnit.toFixed(2)}</td>
                <td class="text-right">${waterTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="text-center">4</td>
                <td>ส่วนกลาง / อื่นๆ</td>
                <td class="text-right">1.00</td>
                <td class="text-right">${bill.otherPrice.toFixed(2)}</td>
                <td class="text-right">${bill.otherPrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            <span style="font-size: 10px; font-weight: normal;">ชำระภายในวันที่ 5 ของทุกเดือน | ttb 6792059567 นายมานะ จงบริบูรณ์</span>
            <span>รวมทั้งสิ้น: ฿${bill.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
};
