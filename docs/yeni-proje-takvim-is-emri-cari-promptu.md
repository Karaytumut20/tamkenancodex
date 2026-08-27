# Yeni Projeye Takvim, İş Emirleri ve Cari Sistemini Aktarma Promptu

Aşağıdaki metni yeni projenin Codex sohbetine tek parça halinde ver. Köşeli parantezli alanları doldurman zorunlu değildir; Codex yeni projeyi inceleyerek uygun karşılıkları bulmalıdır.

---

## Kopyalanacak ana prompt

Yeni projemde çalışan, birbirine tam bağlı bir **Takvim + İş Emirleri/Servis + Cari/Muhasebe + Stok/Malzeme** yönetim sistemi kurmanı istiyorum.

Bu yalnızca görsel birkaç admin sayfası ekleme işi değildir. Randevu, müşteri, iş emri, kullanılan malzeme, stok hareketi, tahsilat, alacak, garanti ve tedarikçi bilgileri aynı veri akışının parçaları olmalı ve bütün ekranlar aynı kayıtlarla senkron çalışmalıdır.

### 1. Çalışmaya başlamadan önce

Önce yeni projenin tamamını incele:

- Kullanılan framework, sürüm, klasör yapısı ve mevcut admin panel mimarisini belirle.
- Kimlik doğrulama, roller, veritabanı bağlantısı, form sistemi, tasarım sistemi ve mevcut müşteri/stok/muhasebe tablolarını tespit et.
- Var olan tabloları veya modülleri kopyalamak yerine onlarla uyumlu biçimde genişlet.
- Benzer isimli mevcut tablolar varsa ikinci bir paralel veri kaynağı oluşturma; mevcut yapıya güvenli biçimde bağlan.
- Uygulamaya geçmeden önce hangi mevcut dosya ve tabloları kullanacağını kısa bir özetle belirt, ardından işi tamamla.
- Yalnızca gerçekten engelleyici ve koddan anlaşılamayan bir konu varsa soru sor.

Varsayılan teknoloji tercihi, proje de uyumluysa:

- Next.js App Router
- TypeScript
- Supabase/PostgreSQL
- Server Actions veya güvenli sunucu API katmanı
- Tailwind CSS ve projenin mevcut bileşen sistemi
- `Europe/Istanbul` saat dilimi ve Türkçe arayüz

Proje farklı bir teknoloji kullanıyorsa aynı davranışı o mimariye uyarlamalısın; sırf bu promptta yazıyor diye çalışan altyapıyı değiştirme.

### 2. Kesin veri güvenliği kuralları

Bu bölüm pazarlık konusu değildir:

- Mevcut hiçbir müşteri, randevu, iş emri, tahsilat, malzeme, stok hareketi, dosya veya geçmiş kaydı silinmeyecek.
- Migration dosyaları **eklemeli, tekrar çalıştırılabilir ve mevcut verilerle uyumlu** olmalı.
- `DROP TABLE`, `TRUNCATE`, toplu `DELETE`, kolon silme, tabloyu yeniden oluşturma veya veriyi sıfırlama kullanma.
- Kolon eklerken mümkünse `ADD COLUMN IF NOT EXISTS`, indekslerde `CREATE INDEX IF NOT EXISTS` kullan.
- Yeni zorunlu alan eklemek gerekiyorsa önce nullable veya güvenli varsayılanla ekle, mevcut veriyi koruyarak doldur, sonra gerekiyorsa kısıt uygula.
- Kullanıcı arayüzündeki “sil” işlemlerinde mümkün olan her yerde `deleted_at`, `is_active` veya iptal durumu ile soft delete kullan.
- Finans ve servis geçmişi olan müşteri/malzeme kayıtlarını fiziksel olarak silme.
- Foreign key ilişkilerinde geçmişi yok edecek `ON DELETE CASCADE` yerine finansal/servis geçmişinde `RESTRICT` veya uygun yerlerde `SET NULL` tercih et.
- Canlı veritabanında deneme kaydı oluşturma, düzenleme veya silme. Önce kod, tip, lint, build ve salt okunur sorgularla doğrula.
- Yazma testi gerekiyorsa yalnızca ayrı test veritabanında veya benim açık onayımla yap.
- Migration’ı kendin uygulayabiliyorsan önce şema ve hedefi doğrula. Uygulayamıyorsan çalıştırmam gereken SQL’i eksiksiz ve doğru sırayla tek dosyada ver.

### 3. Ana veri modeli

Yeni projenin mevcut şemasına uyarlayarak aşağıdaki varlıkları kur veya genişlet. İsimler projeye göre değişebilir fakat ilişkiler ve davranışlar korunmalıdır.

#### Müşteriler

Alanlar:

- `id`
- ad/unvan
- bireysel/kurumsal tipi
- yetkili kişi
- birincil ve ikincil telefon
- e-posta
- vergi numarası ve vergi dairesi
- adres, şehir, ilçe, harita bağlantısı
- genel not
- aktiflik
- `created_at`, `updated_at`, `deleted_at`

Telefon veya proje için uygun başka bir alanla tekrar kayıt kontrolü yap. Müşteri geçmişi tek profil altında görüntülenmeli.

#### Personeller

Alanlar:

- `id`
- ad soyad
- telefon, e-posta
- görev/unvan
- çalışma günleri
- çalışma başlangıç/bitiş saatleri
- not
- aktiflik ve zaman damgaları

#### Randevular

Alanlar:

- `id`
- `customer_id`
- randevu tarihi
- başlangıç ve tahmini bitiş saati
- yapılacak hizmet
- açıklama
- müşterinin bildirdiği sorun
- hizmet adresi, şehir, ilçe, konum bağlantısı
- görevli personel ve yardımcı personel
- öncelik: `normal`, `önemli`, `acil`
- durum
- teknik/personel iç notu
- müşteriye gösterilecek not
- hatırlatma seçeneği
- alınacak tutar
- para birimi: `TRY` veya `USD`
- `created_at`, `updated_at`, `deleted_at`

Randevu durumları:

- Planlandı
- Müşteri Arandı
- Yola Çıkıldı
- İşlem Başladı
- Malzeme Bekleniyor
- İşlem Tamamlandı
- İptal Edildi
- Ertelendi
- Tahsilat Bekleniyor

Alınacak tutar sıfır veya pozitif olmalı. Tutar girmek opsiyonel olmalı; boş bırakılması kayıt oluşturmayı engellememeli.

#### İş emirleri

Alanlar:

- `id`
- benzersiz ve kullanıcı tarafından okunabilir iş emri numarası
- opsiyonel `appointment_id`
- `customer_id`
- başlangıç ve bitiş zamanı
- toplam işçilik saati
- işçilik maliyeti
- müşteriye işçilik/hizmet satış fiyatı
- iş emrinin para birimi: `TRY` veya `USD`
- ulaşım gideri
- ek personel maliyeti
- diğer maliyet/giderler
- indirim
- vergi oranı ve vergi tutarı
- toplam maliyet
- genel toplam
- tahsil edilen toplam
- net kâr
- servis durumu
- teknik personel notu
- müşteri notu
- işlem sırasında kullanılan USD/TL kur değeri ve kur tarihi
- `created_at`, `updated_at`, `deleted_at`

İş emri durumları:

- Taslak
- İşlem Başladı
- Malzeme Bekleniyor
- Tamamlandı
- İptal Edildi

Bir randevuya birden fazla otomatik iş emri açılmaması için `appointment_id` üzerinde uygun bir benzersizlik kuralı veya eşdeğer uygulama kontrolü kur.

#### Stok malzemeleri

Alanlar:

- `id`
- malzeme/ürün adı
- kategori, marka, model
- barkod, SKU
- stok miktarı ve minimum stok seviyesi
- birim alış fiyatı
- opsiyonel satış fiyatı
- tedarikçi/alınan firma
- alış tarihi
- fatura/irsaliye numarası
- garanti süresi (ay)
- depo/raf konumu
- açıklama
- aktiflik ve zaman damgaları

Satış fiyatı, tedarikçi, alış tarihi, belge numarası ve garanti alanları opsiyonel olabilir. Alış fiyatı sıfır olabilir fakat negatif olamaz.

#### İş emrinde kullanılan malzemeler

Bu tablo yalnızca stok tablosuna bağlantı içermemeli; servis anındaki bilgilerin değişmeden kalması için **snapshot** saklamalı:

- `service_order_id`
- opsiyonel `material_id`
- ad, kategori, marka, model
- seri numarası
- birim
- miktar
- servis anındaki birim alış fiyatı ve toplam alış maliyeti
- servis anındaki opsiyonel birim satış fiyatı ve toplam satış fiyatı
- kâr
- malzemenin alındığı tedarikçi firma
- alış tarihi
- fatura/irsaliye numarası
- garanti süresi
- garanti başlangıç tarihi
- otomatik hesaplanan garanti bitiş tarihi
- açıklama
- oluşturulma zamanı

Ana stok kartı daha sonra değiştirilse bile eski müşteriye takılan ürünün alış fiyatı, tedarikçisi, seri numarası ve garanti tarihleri değişmemeli.

#### Stok hareketleri

Alanlar:

- malzeme
- hareket tipi: giriş, çıkış, düzeltme
- miktar
- kaynak tablo ve kaynak kayıt
- açıklama
- zaman damgası

Stoktan seçilen bir malzeme iş emrine eklendiğinde stok otomatik düşmeli. Miktar değiştiğinde yalnızca fark kadar hareket oluşmalı. Kayıt güvenli biçimde geri alındığında stok iade edilmeli. Negatif stoka izin verilmemeli. İş emri malzemesi ile stok hareketi tek transaction içinde tutarlı kalmalı.

#### Tahsilatlar

Alanlar:

- `customer_id`
- opsiyonel `service_order_id`
- ödeme tarihi
- tutar
- para birimi: `TRY` veya `USD`
- yöntem: Nakit, Kredi Kartı, Banka Havalesi, EFT, Çek, Diğer
- işlem/referans numarası
- tahsil eden personel
- açıklama
- tahsilat sırasında kullanılan kur ve kur tarihi
- oluşturulma zamanı
- geçmişi korumak için gerekiyorsa `voided_at`/`deleted_at`

Tutar sıfırdan büyük olmalı. Aynı ödeme iki defa oluşmamalı. Tahsilat düzenlendiğinde veya güvenli biçimde iptal edildiğinde iş emri toplamları yeniden hesaplanmalı.

#### Ek tablolar

Aşağıdaki kayıtları da destekle:

- müşteri notları
- iş emri öncesi fotoğrafı
- iş emri sonrası fotoğrafı
- belge/dosya
- bildirimler
- işlem geçmişi/audit log

Audit log; kullanıcı, işlem tipi, hedef tablo, kayıt kimliği, eski değerler, yeni değerler ve zamanı saklamalı. Hassas alanları gereksiz yere loglama.

### 4. Takvim modülü

Admin panelinde `/admin/calendar` veya projenin route yapısına uygun bir Takvim sayfası oluştur.

Görünümler:

- Aylık
- Haftalık
- Günlük
- Yaklaşan randevular listesi

Davranışlar:

- Hafta pazartesi başlamalı.
- “Bugün”, önceki dönem ve sonraki dönem kontrolleri olmalı.
- Durumlar renklerle kolay ayırt edilmeli.
- Aylık hücrelerde çok kayıt varsa “daha fazla” görünümü açılmalı.
- Randevu kartı sürükle-bırak ile başka güne taşınabilmeli.
- Taşıma sırasında görevli personelin saat çakışması yeniden kontrol edilmeli.
- Sunucu kaydı başarısız olursa arayüz eski tarihe dönmeli ve açık hata göstermeli.
- Gün ve liste görünümünden randevu detayı/düzenleme penceresi açılmalı.
- Mobilde kullanılabilir olmalı.

Randevu ekleme/düzenleme formunda tüm randevu alanları bulunmalı. Özellikle:

- müşteri
- tarih ve saat
- hizmet
- sorun
- görevli ve yardımcı personel
- öncelik ve durum
- adres/konum
- iç not ve müşteri notu
- hatırlatma
- **Alınacak Tutar**
- **TL/USD para birimi**

Kullanıcı bu formdan ayrılmadan:

- yeni müşteri ekleyebilmeli,
- yeni personel ekleyebilmeli,
- kaydedilen yeni kayıt otomatik seçilmeli,
- formdaki mevcut bilgiler kaybolmamalı.

Personel çakışma kuralı:

`yeniBaşlangıç < mevcutBitiş AND yeniBitiş > mevcutBaşlangıç`

Aynı randevu düzenlenirken kendi kaydı çakışma sorgusundan hariç tutulmalı. İptal edilmiş veya soft delete edilmiş kayıtlar çakışmaya dahil edilmemeli.

### 5. Randevu ile iş emri senkronizasyonu

Bu bağlantı mutlaka sunucu tarafında ve atomik/tekrar güvenli biçimde kurulmalı:

- Randevuda alınacak tutar sıfırdan büyük girilirse, o randevuya bağlı iş emri yoksa otomatik bir Taslak iş emri oluştur.
- Randevu durumu “İşlem Başladı” veya “İşlem Tamamlandı” olduğunda da bağlı iş emrinin varlığını garanti et.
- Aynı işlem tekrar çalıştırıldığında ikinci iş emri oluşturma.
- Randevudaki müşteri değişirse bağlı iş emrinin müşterisini güvenli biçimde güncelle.
- Randevudaki alınacak tutar veya para birimi değişirse bağlı iş emrinin hizmet/işçilik satış tutarını güncelle ve finans toplamlarını yeniden hesapla.
- Randevu tutarı sonradan sıfır yapılırsa eski tahsilatları silme. İş emrindeki yeni beklenen toplamı hesapla ve kullanıcıya tahsil edilen tutar yeni toplamı aşıyorsa uyarı ver.
- İş emri “Tamamlandı” yapılırsa bağlı randevu “İşlem Tamamlandı” olmalı.
- Randevu iptali iş emrini veya tahsilat geçmişini fiziksel olarak silmemeli.
- Tüm değişiklikler audit loga yazılmalı.

### 6. İş emirleri listesi

Liste ekranında:

- iş emri numarası
- tarih
- müşteri
- hizmet
- toplam tutar
- kalan alacak
- ödeme durumu
- servis durumu
- detay/düzenleme işlemi

bulunsun.

Arama:

- müşteri adı
- telefon
- iş emri numarası
- hizmet adı

Filtreler:

- servis durumu
- tahsilat bekleyen
- hiç ödenmeyen
- kısmi ödenen
- tamamı ödenen

Üst özetler:

- Aktif İşler
- Tamamlanan İşler
- Toplam Kalan Alacak

TRY ve USD alacakları birbirine doğrudan ekleme; ayrı göster. İstenirse güncel kurla TL karşılığını ayrıca, açıkça “yaklaşık karşılık” etiketiyle göster.

“Bekleyen İş” gibi yanlış anlaşılacak bir etiket kullanma. Henüz tamamlanmamış servis kayıtları için **Aktif İşler** ifadesini kullan.

### 7. Tek ekrandan yeni iş emri / hızlı işlem

Kullanıcı başka admin sayfalarına gitmeden tek pencereden veya tek sayfadan:

- müşteriyi seçsin veya yeni müşteri eklesin,
- işlem/hizmet adını yazsın,
- hizmet fiyatını ve TL/USD seçimini yapsın,
- stoktan ürün seçsin veya yeni malzeme oluştursun,
- kullanılacak miktarı girsin,
- işlemin peşin ödenip ödenmediğini seçsin,
- ödendiyse yöntem seçsin,
- isterse ileri tarihli randevu oluştursun.

Yeni müşteri veya malzeme ekleme modalı kapanınca form verileri kaybolmamalı ve yeni kayıt otomatik seçilmeli.

İşlem tek akışta güvenli çalışmalı. Adımlardan biri başarısız olduğunda yarım/yetim kayıt bırakmamak için database transaction veya telafi mekanizması kullan.

### 8. İş emri detay sayfası

İş emri detayında şu sekmeler olmalı:

1. Genel Bilgiler
2. Malzemeler
3. Ödemeler & Tahsilat
4. Görseller & Dosyalar
5. İşlem Geçmişi

Üst bölüm:

- iş emri numarası ve durum
- müşteri bağlantısı
- telefonla ara
- WhatsApp
- Yazdır/PDF
- listeye dön

Finans özeti:

- Toplam Maliyet
- Müşteri Toplamı
- Kalan Bakiye
- Net Kâr ve kâr oranı

`service_staff` benzeri saha personeli rolü alış fiyatı, maliyet ve kârı görememeli. Bu kısıtlama yalnızca CSS ile gizleme olmamalı; veri sorgusu/API yetkisi de role göre sınırlandırılmalı.

#### Genel bilgiler

- servis durumu
- işçilik süresi
- işçilik maliyeti
- müşteriye işçilik/hizmet satış tutarı
- TL/USD seçimi
- ulaşım gideri
- ek personel maliyeti
- diğer giderler
- indirim
- vergi oranı
- teknik personel notu
- müşteri notu

Sayısal alanlardaki tarayıcı artırma/azaltma oklarını CSS ile kaldır. Boş değerleri kullanıcı yazarken zorla `0` yapıp yazımı bozma; kaydederken güvenli biçimde sayıya çevir ve doğrula.

#### Malzemeler

Kullanıcı:

- stoktan malzeme seçebilmeli,
- aynı ekrandan yeni malzeme ekleyebilmeli,
- stoksuz/harici bir malzemeyi elle girebilmeli.

Malzeme formu şu soruları sormalı:

- Malzeme adı nedir?
- Kategori, marka ve model nedir?
- Seri numarası nedir?
- Birim ve miktar nedir?
- Birim alış fiyatı nedir?
- Opsiyonel satış fiyatı nedir?
- Hangi tedarikçi firmadan alındı?
- Hangi tarihte alındı?
- Fatura/irsaliye numarası nedir?
- Garanti süresi kaç ay?
- Garanti hangi tarihte başladı?
- Ek açıklama var mı?

Garanti başlangıcı boşsa alış tarihini kullan. Ay bazında bitiş tarihini otomatik hesapla. Müşteri profilinde:

- garanti devam ediyor,
- bitmesine az kaldı,
- süresi doldu,
- garanti bilgisi yok

durumlarını renkli etiketle göster. Ayrıca alıştan/montajdan beri geçen süreyi göster.

#### Tahsilat

Tahsilat alanında:

- tarih
- para birimi
- yöntem
- alınacak tutar
- tahsil eden personel
- işlem/referans numarası
- açıklama

bulunsun.

Kullanıcı kısmi tutar girebilmeli. Ayrıca **“Kalan tutarın tamamı alındı”** onay kutusu/butonu olmalı. İşaretlendiğinde alan, seçilen tahsilat para birimine göre izin verilen maksimum kalan tutarla otomatik dolmalı.

Kurallar:

- Kalan tutardan fazla tahsilata izin verme.
- İş emri ve tahsilat farklı para birimindeyse kayıtlı işlem kuruyla doğru dönüşüm yap.
- Maksimum tahsil edilebilir tutarı formda göster.
- Tahsilat sonrası `paid_amount`, kalan bakiye, cari özet ve dashboard aynı anda güncellensin.
- Tam ödemede ödeme geçmişine gerçek bir tahsilat kaydı ekle; yalnızca boolean işaretleme yapma.
- Tahsilat düzenleme/iptal yetkisini role göre sınırla ve audit loga yaz.

#### Dosyalar ve yazdırma

- İş öncesi fotoğraf
- İş sonrası fotoğraf
- Belge

yüklenebilmeli. Dosyaları public klasöre kontrolsüz yazma; projenin kalıcı storage çözümünü kullan, dosya tipi/boyutu doğrula ve erişimi yetkilendir.

Yazdırılabilir servis formunda:

- firma bilgileri
- iş emri ve müşteri bilgileri
- servis detayları
- kullanılan malzemeler
- garanti koşulları
- finansal hesap
- tahsilat geçmişi

yer almalı.

### 9. Cari ve muhasebe modülü

Muhasebe ekranında iş emirlerini finans kaynağı olarak kullan. Ekranda:

- TRY Kasası
  - Faturalanan
  - Tahsil Edilen
  - Kalan Alacak
  - Toplam Maliyet
- USD Kasası
  - Faturalanan
  - Tahsil Edilen
  - Kalan Alacak
  - Toplam Maliyet

ayrı gösterilsin.

Liste satırlarında:

- iş emri
- müşteri
- işlem tutarı
- tahsil edilen
- kalan
- net kâr
- servis durumu
- detay
- tamamını tahsil et

bulunsun.

Müşteri ve iş emri numarasıyla arama, müşteriye göre filtre olmalı.

Muhasebedeki “tamamını tahsil et” işlemi:

- kullanıcıdan onay almalı,
- kalan tutar kadar gerçek bir tahsilat kaydı oluşturmalı,
- mevcut ödemeleri değiştirmemeli veya silmemeli,
- işlem zaten tamamen ödenmişse ikinci kayıt oluşturmamalı,
- eşzamanlı çift tıklamaya/idempotency sorununa karşı korunmalı.

### 10. Müşteri cari profili

Müşteri detayında şu sekmeler olmalı:

- Genel
- Randevular
- Aktif ve Tamamlanan İşler
- Kullanılan Malzemeler
- Teklifler/Taslak İşler
- Tahsilatlar
- Borç & Alacak
- Notlar
- Dosyalar & Görseller

Malzeme geçmişinde tedarikçi, alış tarihi, seri numarası ve garanti durumu görülebilmeli. Böylece bir ürün arızalandığında kime ait olduğu, kimden ne zaman alındığı ve garantisinin devam edip etmediği anlaşılmalı.

Borç/alacak hesapları:

- İptal edilmiş iş emirlerini satış/alacak toplamına katma.
- TRY ve USD hesaplarını ayrı tut.
- `Kalan = max(0, Faturalanan - Tahsil Edilen)` formülünü kullan.
- İş emrine bağlı tahsilatı iki kez toplama.
- İş emrine bağlı olmayan müşteri tahsilatlarını ayrıca açıkça göster; bunların avans mı genel ödeme mi olduğunu açıklama alanından ayırt et.

### 11. Finans hesaplama kuralları

Tek bir merkezi hesap fonksiyonu kullan. UI içinde ve farklı sayfalarda aynı formülü ayrı ayrı kopyalama.

Temel formüller:

```text
malzeme_toplam_maliyeti =
  Σ (miktar × birim_alış_fiyatı)

malzeme_toplam_satışı =
  Σ (miktar × birim_satış_fiyatı)

toplam_maliyet_TL =
  malzeme_toplam_maliyeti
  + işçilik_maliyeti
  + ulaşım_gideri
  + ek_personel_maliyeti
  + diğer_giderler

vergilendirilebilir_tutar =
  max(0, malzeme_satışı_iş_emri_para_biriminde
  + müşteriye_işçilik_hizmet_satışı
  - indirim)

vergi_tutarı =
  vergilendirilebilir_tutar × vergi_oranı / 100

genel_toplam =
  vergilendirilebilir_tutar + vergi_tutarı

tahsil_edilen =
  aynı iş emrine bağlı geçerli tahsilatların
  iş emri para birimine çevrilmiş toplamı

kalan =
  max(0, genel_toplam - tahsil_edilen)

net_kâr =
  genel_toplam - iş_emri_para_birimine_çevrilmiş_toplam_maliyet
```

Para kuralları:

- Para değerlerinde kayan nokta hatası üretme; veritabanında `numeric/decimal`, uygulamada güvenli decimal/cent yaklaşımı kullan.
- USD/TL kurunu TCMB’nin resmi günlük kurundan sunucu tarafında al.
- Admin panelinin üst kısmında örneğin `1 USD = 00,0000 TL · TCMB · tarih` göster.
- Kur isteğini önbellekle; harici servis çalışmazsa son başarılı kayıtlı kuru kullan ve “güncel değil” uyarısı göster.
- **Sabit 34 gibi hard-coded kur kullanma.**
- Güncel kuru gösterirken işlem geçmişini değiştirme. Finansal kayıt oluşturulduğu anda kullanılan kuru ve tarihini kaydet; geçmiş hesaplar bu snapshot kurla sabit kalsın.
- TRY ve USD tutarları ayrı raporlanmalı. Toplama gerekiyorsa kullanılan kur ve yaklaşık karşılık açıkça belirtilmeli.

### 12. Dashboard göstergeleri

Dashboard verileri gerçek tablolardan, aynı iş kurallarıyla hesaplanmalı:

- Bugün Randevu: İstanbul tarihine göre bugünkü, silinmemiş randevu sayısı
- Yarın Randevu: İstanbul tarihine göre yarınki, silinmemiş randevu sayısı
- Haftalık Biten: pazartesi-pazar aralığında `finished_at` değeri bulunan tamamlanmış iş emri sayısı
- Aktif İşler: Tamamlandı ve İptal Edildi dışındaki silinmemiş iş emirleri
- Tahsilat Bekleyen: `genel_toplam - tahsil_edilen > 0,01` olan silinmemiş iş emri sayısı
- Toplam Müşteri: silinmemiş müşteri sayısı
- Düşük Stok: stok miktarı minimum seviyede veya altındaki aktif malzeme sayısı

“Toplam İş” ile “Aktif İş” birbirine karıştırılmamalı. Dashboard, iş emirleri listesi, cari ve muhasebe aynı filtre ve formülleri kullanmalı.

### 13. Kolay ekleme yaklaşımı

“Kolay Ekle” ayrı, genel bir sayfaya yönlendiren buton değildir. İlgili kayıt nerede gerekiyorsa kullanıcı o formdan ayrılmadan ekleyebilmelidir:

- Randevuda müşteri ve personel
- İş emrinde müşteri, malzeme ve personel
- Tahsilatta tahsil eden personel
- Malzemede kategori, marka ve gerekiyorsa tedarikçi

Modal/drawer kapandığında:

- ana formdaki girilmiş bilgiler korunmalı,
- yeni kayıt seçenek listesine eklenmeli,
- otomatik seçilmeli,
- sayfa tamamen yenilenmek zorunda kalmamalı.

### 14. Yetki ve güvenlik

En az şu yetki seviyelerini destekle veya mevcut rollere eşle:

- super admin
- editor/yönetici
- destek
- servis personeli
- salt görüntüleyici

Kurallar:

- Kimliği doğrulanmamış kullanıcı admin verisini okuyamamalı.
- RLS/API yetkileri yalnızca “authenticated = her şeyi yapabilir” kadar geniş bırakılmamalı; rol ve işlem bazında tasarlanmalı.
- Servis personeli maliyet/kâr alanlarını ağ yanıtında bile almamalı.
- Salt görüntüleyici yazma işlemi yapamamalı.
- Finansal silme/iptal işlemleri yüksek yetki gerektirmeli.
- Tüm Server Action/API girişlerini Zod veya eşdeğer şema ile sunucuda doğrula.
- Müşteri tarafından girilen veya yüklenen içerikleri güvenli biçimde işle.

### 15. Uygulama kalitesi

- Mevcut admin panelinin görsel dilini koru.
- Türkçe karakterleri UTF-8 olarak doğru sakla; bozuk `Ã`, `Ä`, `Å` karakterleri üretme.
- Tüm form etiketleri gerçek inputlarla `htmlFor/id` üzerinden bağlı olmalı.
- Butonlarda doğru `type` kullan.
- Yükleme, başarı, hata, boş liste ve yetkisiz durumlarını tasarla.
- Form gönderilirken çift tıklamayı engelle.
- Mobil, tablet ve masaüstünde kullanılabilir yap.
- Veri sorgularında N+1 problemi oluşturma; uygun join, indeks ve paralel sorgu kullan.
- Kritik hesap ve senkronizasyonları yalnızca client state’e bırakma.
- Sayfalar arası güncellemelerde gerekli cache invalidation/revalidation işlemlerini yap.

### 16. SQL/migration beklentisi

Şema değişikliği gerekiyorsa:

1. Mevcut şemayı incele.
2. Eksik alanları belirle.
3. Tekrar çalıştırılabilir, eklemeli migration dosyaları oluştur.
4. Constraint isimlerini kontrol ederek çakışmayı önle.
5. Gerekli foreign key ve indeksleri ekle.
6. Stok ve finans tutarlılığı için transaction/RPC gerekiyorsa güvenli fonksiyonlar oluştur.
7. RLS politikalarını role göre ekle.
8. Migration sırasını açıkça belirt.
9. SQL’i uygulayamazsan bana kopyalayıp çalıştırabileceğim eksiksiz kodu ver.

Migration tamamlanmadan uygulama kodunu “tamamlandı” sayma. Ancak canlı veritabanına izinsiz veri yazma.

### 17. Kabul testleri

Önce otomatik ve salt okunur testleri çalıştır. Aşağıdaki senaryoların tamamını kontrol et:

#### Randevu

- Yeni randevu ekleniyor.
- Düzenleme mevcut bilgileri doğru getiriyor.
- Sürükle-bırak tarihi değiştiriyor.
- Personel çakışması engelleniyor.
- Hızlı müşteri/personel ekleme form verisini koruyor.
- Alınacak tutar ve para birimi saklanıyor.

#### Randevu → iş emri

- Tutar girilen randevu tek bir iş emri oluşturuyor.
- Aynı kayıt tekrar kaydedilince ikinci iş emri oluşmuyor.
- Tutar/para birimi değişince iş emri ve cari yeniden hesaplanıyor.
- İş emri tamamlanınca randevu durumu senkron oluyor.

#### Malzeme ve stok

- Stoktan malzeme ekleme stoğu doğru düşürüyor.
- Yetersiz ve negatif stok engelleniyor.
- Harici/stoksuz malzeme eklenebiliyor.
- Alış fiyatı, opsiyonel satış fiyatı, tedarikçi, alış tarihi, seri ve garanti bilgileri kalıcı oluyor.
- Ana stok kartı değişse bile eski servis snapshotı değişmiyor.
- Garanti bitiş tarihi doğru hesaplanıyor.

#### Finans ve tahsilat

- Genel toplam formülü doğru.
- Kısmi tahsilat kalan bakiyeyi doğru azaltıyor.
- “Tamamı alındı” tam kalan kadar ödeme oluşturuyor.
- Fazla tahsilat engelleniyor.
- TRY/USD dönüşümü kayıtlı kurla doğru.
- Tahsilat güncelleme/iptalinden sonra toplamlar yenileniyor.
- Dashboard, iş emri, müşteri carisi ve muhasebe aynı sonucu gösteriyor.

#### Yetki, etiket ve kalite

- Servis personeli maliyet ve kârı göremiyor.
- Viewer yazamıyor.
- Form label-input bağlantıları çalışıyor.
- TypeScript kontrolü, lint, testler ve production build geçiyor.
- Tarayıcı konsolunda uygulama hatası yok.
- Masaüstü ve mobil ana akışlar çalışıyor.

Canlı ortamda yazma testi yapmadan önce benden onay al. Onay yoksa UI’yi aç, buton/modal/form davranışlarını kaydetmeden test et; veri doğruluğunu salt okunur sorgularla karşılaştır.

### 18. Teslim şekli

Çalışma sonunda bana şunları ver:

- Yapılanların kısa özeti
- Değiştirilen dosyalar
- Eklenen/etkilenen tablolar ve kolonlar
- Uygulanması gereken SQL migration dosyaları ve sırası
- Çalıştırılan testler ve sonuçları
- Yazma testi yapılmadıysa bunun açık notu
- Varsa kalan riskler veya manuel doğrulama maddeleri

Yalnızca taslak veya örnek kod verme. Yeni projenin mevcut mimarisine entegre, derlenen ve veri akışları birbirine bağlı çalışan uygulamayı tamamla.

---

## Mevcut sistemden çıkarılan temel akış

```text
Müşteri
  ├─ Randevu
  │    └─ Alınacak tutar veya servis başlangıcı
  │          └─ Tek ve bağlı İş Emri
  ├─ İş Emri
  │    ├─ Kullanılan Malzemeler ──> Stok Hareketleri
  │    ├─ Satın Alma/Garanti Snapshotı
  │    ├─ Tahsilatlar
  │    ├─ Dosyalar
  │    └─ Audit Log
  └─ Cari Profil
       ├─ Faturalanan
       ├─ Tahsil Edilen
       └─ Kalan Alacak

İş Emirleri + Tahsilatlar
  ├─ Muhasebe ekranı
  └─ Dashboard göstergeleri
```

Bu prompt mevcut sistemdeki işlevleri korurken yeni projede özellikle şu iki teknik riski daha güvenli ele alacak şekilde hazırlanmıştır:

1. Sabit döviz kuru yerine güncel kur ve işlem anı kur snapshotı kullanılması.
2. Finans/servis geçmişinde fiziksel silme ve geniş `ON DELETE CASCADE` ilişkileri yerine geçmişi koruyan soft delete/iptal yaklaşımı.
