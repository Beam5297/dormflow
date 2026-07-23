import { supabase } from './supabase';

export interface SettingsData {
  dormName: string;
  address: string;
  phone: string;
  waterRate: number;
  electricRate: number;
  commonFee: number;
  bankName: string;
  accountNo: string;
  accountName: string;
  promptPay: string;
}

export async function getSettings(): Promise<SettingsData> {
  const { data } = await supabase.from('settings').select('*').eq('id', 'default_settings').single();
  if (!data) {
    return {
      dormName: 'หอพัก DormFlow',
      address: '123/45 ถนนสุขุมวิท',
      phone: '081-234-5678',
      waterRate: 18,
      electricRate: 8,
      commonFee: 100,
      bankName: 'กสิกรไทย',
      accountNo: 'xxx-x-xxxxx-x',
      accountName: 'เจ้าของหอพัก',
      promptPay: '0812345678',
    };
  }
  return {
    dormName: data.dorm_name || '',
    address: data.address || '',
    phone: data.phone || '',
    waterRate: Number(data.water_rate) || 0,
    electricRate: Number(data.electric_rate) || 0,
    commonFee: Number(data.common_fee) || 0,
    bankName: data.bank_name || '',
    accountNo: data.account_no || '',
    accountName: data.account_name || '',
    promptPay: data.prompt_pay || '',
  };
}

export async function saveSettings(settings: SettingsData) {
  await supabase.from('settings').upsert({
    id: 'default_settings',
    dorm_name: settings.dormName,
    address: settings.address,
    phone: settings.phone,
    water_rate: settings.waterRate,
    electric_rate: settings.electricRate,
    common_fee: settings.commonFee,
    bank_name: settings.bankName,
    account_no: settings.accountNo,
    account_name: settings.accountName,
    prompt_pay: settings.promptPay,
  });
}